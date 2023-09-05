// main.rs

// Import modules
mod capture;
mod preprocess;
mod encode;
mod packetize;

use tokio::net::UdpSocket;
use std::error::Error;
use log::{info, error};

// Initialize logger
fn init_logger() {
    env_logger::init();
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Initialize the logger
    init_logger();
    info!("Video streaming service started.");

    // Initialize FFmpeg for preprocessing and encoding
    preprocess::init_ffmpeg()?;
    encode::init_ffmpeg()?;

    // Create a UDP socket for capturing video
    let socket = UdpSocket::bind("0.0.0.0:8080").await?;

    // Capture raw video data
    let raw_video = capture::capture_video(socket).await?;

    // Dummy variables for example
    let width = 1920;
    let height = 1080;
    let new_width = 960;
    let new_height = 540;
    let sequence_number: u16 = 1;
    let timestamp: u32 = 1000;

    // Preprocess the frame
    let preprocessed_frame = preprocess::preprocess_video(raw_video, width, height, new_width, new_height)?;

    // Encode the frame
    let encoded_packet = encode::encode_frame_av1(preprocessed_frame, new_width, new_height)?;

    // Packetize the encoded frame
    let rtp_packets = packetize::packetize_into_rtp(encoded_packet, sequence_number, timestamp)?;

    info!("Successfully processed {} RTP packets.", rtp_packets.len());

    // Here you can send RTP packets over the network
    // ...

    Ok(())
}
// main.rs

// Import modules
mod capture;
mod preprocess;
mod encode;
mod packetize;

use tokio::net::UdpSocket;
use std::error::Error;
use log::{info, error};

// Initialize logger
fn init_logger() {
    env_logger::init();
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Initialize the logger
    init_logger();
    info!("Video streaming service started.");

    // Initialize FFmpeg for preprocessing and encoding
    preprocess::init_ffmpeg()?;
    encode::init_ffmpeg()?;

    // Create a UDP socket for capturing video
    let socket = UdpSocket::bind("0.0.0.0:8080").await?;

    // Capture raw video data
    let raw_video = capture::capture_video(socket).await?;

    // Dummy variables for example
    let width = 1920;
    let height = 1080;
    let new_width = 960;
    let new_height = 540;
    let sequence_number: u16 = 1;
    let timestamp: u32 = 1000;

    // Preprocess the frame
    let preprocessed_frame = preprocess::preprocess_video(raw_video, width, height, new_width, new_height)?;

    // Encode the frame
    let encoded_packet = encode::encode_frame_av1(preprocessed_frame, new_width, new_height)?;

    // Packetize the encoded frame
    let rtp_packets = packetize::packetize_into_rtp(encoded_packet, sequence_number, timestamp)?;

    info!("Successfully processed {} RTP packets.", rtp_packets.len());

    // Here you can send RTP packets over the network
    // ...

    Ok(())
}
