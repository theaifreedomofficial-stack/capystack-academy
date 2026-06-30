"""
ComfyUI REST client.
Submits a text-to-image workflow via the /prompt endpoint and polls for results.
"""
import json
import time
import uuid
import os
import base64
import urllib.request
import urllib.parse
from typing import Optional

from config import COMFYUI_URL, COMFYUI_ENABLED, COMFYUI_CHECKPOINT, IMAGES_DIR, logger


def _build_txt2img_workflow(prompt: str, negative_prompt: str,
                             width: int = 1024, height: int = 1024) -> dict:
    """Minimal SDXL-compatible ComfyUI workflow."""
    client_id = str(uuid.uuid4())
    return {
        "prompt": {
            "3": {
                "class_type": "KSampler",
                "inputs": {
                    "seed": int(time.time()) % 2**31,
                    "steps": 20,
                    "cfg": 7.0,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["4", 0],
                    "positive": ["6", 0],
                    "negative": ["7", 0],
                    "latent_image": ["5", 0],
                }
            },
            "4": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": {"ckpt_name": COMFYUI_CHECKPOINT}
            },
            "5": {
                "class_type": "EmptyLatentImage",
                "inputs": {"width": width, "height": height, "batch_size": 1}
            },
            "6": {
                "class_type": "CLIPTextEncode",
                "inputs": {"text": prompt, "clip": ["4", 1]}
            },
            "7": {
                "class_type": "CLIPTextEncode",
                "inputs": {"text": negative_prompt or "blurry, low quality, text, watermark", "clip": ["4", 1]}
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {"samples": ["3", 0], "vae": ["4", 2]}
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {"images": ["8", 0], "filename_prefix": "social_agent"}
            }
        },
        "client_id": client_id,
    }


def generate_image(prompt: str, negative_prompt: str = "",
                   width: int = 1024, height: int = 1024,
                   timeout: int = 180) -> Optional[str]:
    """
    Submit a ComfyUI image generation job and return the local file path.
    Returns None if ComfyUI is disabled or generation fails.
    """
    if not COMFYUI_ENABLED:
        logger.info("ComfyUI disabled — skipping image generation")
        return None

    try:
        workflow = _build_txt2img_workflow(prompt, negative_prompt, width, height)
        client_id = workflow["client_id"]

        # Submit prompt
        data = json.dumps(workflow).encode("utf-8")
        req = urllib.request.Request(
            f"{COMFYUI_URL}/prompt",
            data=data,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())

        prompt_id = resp.get("prompt_id")
        if not prompt_id:
            logger.error("ComfyUI returned no prompt_id")
            return None

        logger.info(f"ComfyUI job submitted: {prompt_id}")

        # Poll for completion
        deadline = time.time() + timeout
        while time.time() < deadline:
            time.sleep(3)
            try:
                with urllib.request.urlopen(
                    f"{COMFYUI_URL}/history/{prompt_id}", timeout=10
                ) as r:
                    history = json.loads(r.read())

                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    for node_id, node_out in outputs.items():
                        images = node_out.get("images", [])
                        if images:
                            img_info = images[0]
                            img_url = (f"{COMFYUI_URL}/view?"
                                       f"filename={urllib.parse.quote(img_info['filename'])}"
                                       f"&subfolder={urllib.parse.quote(img_info.get('subfolder',''))}"
                                       f"&type={img_info.get('type','output')}")

                            # Download and save locally
                            local_path = os.path.join(
                                IMAGES_DIR,
                                f"{prompt_id}_{img_info['filename']}"
                            )
                            with urllib.request.urlopen(img_url, timeout=30) as img_r:
                                with open(local_path, "wb") as f:
                                    f.write(img_r.read())

                            logger.info(f"Image saved: {local_path}")
                            return local_path
            except Exception as poll_err:
                logger.warning(f"Poll error: {poll_err}")

        logger.error(f"ComfyUI timeout after {timeout}s for job {prompt_id}")
        return None

    except Exception as e:
        logger.error(f"ComfyUI generation error: {e}")
        return None


def generate_images_for_job(image_prompts: list[dict]) -> list[str]:
    """Generate multiple images for a content job. Returns list of saved file paths."""
    paths = []
    for i, prompt_obj in enumerate(image_prompts[:3]):  # max 3 images per job
        prompt_text = prompt_obj.get("prompt", "")
        negative = prompt_obj.get("negative_prompt", "")
        w = prompt_obj.get("width", 1024)
        h = prompt_obj.get("height", 1024)

        if not prompt_text:
            continue

        logger.info(f"Generating image {i+1}/3...")
        path = generate_image(prompt_text, negative, w, h)
        if path:
            paths.append(path)

    return paths
