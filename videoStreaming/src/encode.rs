// encode.rs

use ffmpeg::codec::{self, Context};
use ffmpeg::util::frame::video::Video as Frame;
use ffmpeg_next as ffmpeg;
use log::{error, info};
use std::error::Error;

// Custom Error Types
#[derive(Debug)]
pub enum EncodeError {
    EncoderCreationError,
    PacketError,
}

// Type alias for PreprocessedVideoFrame and EncodedVideoPacket
pub type PreprocessedVideoFrame = Vec<u8>;
pub type EncodedVideoPacket = Vec<u8>;

// Initialize FFmpeg
pub fn init_ffmpeg() -> Result<(), EncodeError> {
    ffmpeg::init().map_err(|_| EncodeError::EncoderCreationError)
}

// Encode a video frame using the AV1 codec
pub fn encode_frame_av1(
    frame: PreprocessedVideoFrame,
    width: usize,
    height: usize,
) -> Result<EncodedVideoPacket, EncodeError> {
    // Setup format and codec
    let codec = codec::encoder::find(codec::Id::AV1).ok_or(EncodeError::EncoderCreationError)?;

    // Create an encoder context
    let mut encoder = codec.encoder().video();
    encoder.set_width(width as u32);
    encoder.set_height(height as u32);
    let encoder = encoder.open_as(codec).unwrap();

    // Create an FFmpeg frame from the preprocessed frame
    let mut ffmpeg_frame = Frame::empty(width, height, Pixel::RGB24);
    ffmpeg_frame.data_mut(0).copy_from_slice(&frame);

    // Encode the frame
    let mut packet = ffmpeg::util::packet::Packet::empty();
    encoder
        .encode(&ffmpeg_frame, &mut packet)
        .map_err(|_| EncodeError::PacketError)?;

    info!("Successfully encoded a video frame with AV1.");

    Ok(packet.data().to_vec())
}
