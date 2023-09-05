// preprocess.rs

use ffmpeg::format::Pixel;
use ffmpeg::software::scaling::{Context, Flags};
use ffmpeg::util::frame::video::Video as Frame;
use ffmpeg_next as ffmpeg;
use log::{error, info};
use std::error::Error;

// Custom Error Types
#[derive(Debug)]
pub enum PreprocessError {
    ScalingError,
    FfmpegInitializationError,
}

// Type alias for PreprocessedVideoFrame and RawVideoFrame
pub type PreprocessedVideoFrame = Vec<u8>;
pub type RawVideoFrame = Vec<u8>;

// Initialize FFmpeg
pub fn init_ffmpeg() -> Result<(), PreprocessError> {
    ffmpeg::init().map_err(|_| PreprocessError::FfmpegInitializationError)
}

// Preprocess a single video frame: Scale the video resolution
pub fn preprocess_video(
    frame: RawVideoFrame,
    width: usize,
    height: usize,
    new_width: usize,
    new_height: usize,
) -> Result<PreprocessedVideoFrame, PreprocessError> {
    // Create a scaling context
    let context = Context::get(
        Pixel::RGB24,
        width,
        height,
        Pixel::RGB24,
        new_width,
        new_height,
        Flags::BILINEAR,
    )
    .map_err(|_| PreprocessError::ScalingError)?;

    // Perform the scaling operation
    match context.run(&frame) {
        Ok(scaled_frame) => {
            info!("Successfully scaled the video frame.");
            Ok(scaled_frame)
        }
        Err(_) => {
            error!("Failed to scale the video frame.");
            Err(PreprocessError::ScalingError)
        }
    }
}
