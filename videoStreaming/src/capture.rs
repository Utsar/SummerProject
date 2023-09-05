// capture.rs

use tokio::net::UdpSocket;
use log::{info, warn, error};
use std::error::Error;
use tokio::sync::mpsc;
use std::collections::VecDeque;

// Custom Error Types
#[derive(Debug)]
pub enum CaptureError {
    SocketBindError,
    ReceiveError,
}

// Type alias for RawVideo and RawVideoFrame
pub type RawVideo = Vec<u8>;

// Capture raw video data from incoming network packets
pub async fn capture_video(stop_signal: mpsc::Receiver<()>) -> Result<RawVideo, CaptureError> {
    // Create a UDP socket bound to a specific port to listen for incoming packets.
    let mut socket = UdpSocket::bind("0.0.0.0:8080").await.map_err(|_| CaptureError::SocketBindError)?;
    
    // Create a buffer to store the incoming data.
    let mut buf = [0u8; 4096];
    
    // Buffer to hold the raw video data
    let mut raw_video: RawVideo = Vec::new();

    info!("Started capturing video.");

    // Loop to keep receiving data packets
    loop {
        tokio::select! {
            // Stop condition from external input
            _ = stop_signal.recv() => {
                info!("Received stop signal. Stopping video capture.");
                break;
            }
            // Receiving data from UDP socket
            result = socket.recv_from(&mut buf) => {
                match result {
                    Ok((size, _src_addr)) => {
                        // Append received data to the raw video buffer
                        raw_video.extend_from_slice(&buf[0..size]);
                    }
                    Err(_) => {
                        error!("An error occurred while receiving data.");
                        return Err(CaptureError::ReceiveError);
                    }
                }
            }
        }

        // Stop condition for this example: stop after capturing 1MB.
        // In a real-world scenario, you might use a different condition.
        if raw_video.len() >= 1_000_000 {
            warn!("Reached data limit. Stopping video capture.");
            break;
        }
    }
    
    info!("Captured {} bytes of raw video data.", raw_video.len());
    Ok(raw_video)
}
