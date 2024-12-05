import shutil
import subprocess
import tempfile
import time
import os
import platform
from pathlib import Path

if platform.system() == "Windows":
    import ctypes
    from ctypes import wintypes

    def reset_creation_time(file_path):
        """Reset creation time on Windows."""
        FILE_WRITE_ATTRIBUTES = 0x0100
        handle = ctypes.windll.kernel32.CreateFileW(
            file_path, FILE_WRITE_ATTRIBUTES, 0, None, 3, 0x80, None
        )
        if handle != -1:
            creation_time = wintypes.FILETIME(0, 0)  # Reset to epoch
            ctypes.windll.kernel32.SetFileTime(handle, ctypes.byref(creation_time), None, None)
            ctypes.windll.kernel32.CloseHandle(handle)


def clean_metadata(file_path):
    """Clean metadata of the provided file and return the cleaned file path."""
    try:
        # Define the cleaned file path in the uploads directory
        file_dir, file_name = os.path.split(file_path)
        base_name, extension = os.path.splitext(file_name)
        cleaned_file_name = f"{base_name}_Cleaned{extension}"
        cleaned_file_path = os.path.join("uploads", cleaned_file_name)

        # Ensure the uploads directory exists
        os.makedirs("uploads", exist_ok=True)

        # Copy the file to the cleaned file path
        shutil.copy(file_path, cleaned_file_path)

        # Clean the metadata
        result = subprocess.run(
            [
                "exiftool",
                "-all=",  # Remove all metadata
                "-tagsFromFile", "@",  # Preserve minimal technical details
                "-icc_profile",  # Optionally preserve ICC profiles
                "-overwrite_original",
                cleaned_file_path
            ],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            cleaned_metadata_result = subprocess.run(
                ["exiftool", cleaned_file_path], capture_output=True, text=True
            )

            if cleaned_metadata_result.returncode == 0:
                os.utime(cleaned_file_path, (time.time(), time.time()))  # Reset access and modification times
                if platform.system() == "Windows":
                    reset_creation_time(cleaned_file_path)

                return cleaned_file_path, cleaned_metadata_result.stdout
            else:
                raise Exception(f"Error cleaning metadata: {cleaned_metadata_result.stderr}")
        else:
            raise Exception(f"Error processing metadata cleaning: {result.stderr}")
    except Exception as e:
        return str(e), None
