// packetize.rs

use log::{error, info};
use std::error::Error;

// Custom Error Types
#[derive(Debug)]
pub enum PacketizeError {
    PacketizationError,
}

// Type alias for EncodedVideoPacket and RtpPacket
pub type EncodedVideoPacket = Vec<u8>;
pub type RtpPacket = Vec<u8>;

// Create RTP packets from an encoded video packet
pub fn packetize_into_rtp(
    encoded_packet: EncodedVideoPacket,
    sequence_number: u16,
    timestamp: u32,
) -> Result<Vec<RtpPacket>, PacketizeError> {
    // RTP Header size is 12 bytes
    const RTP_HEADER_SIZE: usize = 12;
    // Maximum RTP payload size for this example is 1400 bytes (this can vary)
    const MAX_RTP_PAYLOAD_SIZE: usize = 1400;

    let mut rtp_packets: Vec<RtpPacket> = Vec::new();

    // Split the encoded packet into chunks of MAX_RTP_PAYLOAD_SIZE
    for chunk in encoded_packet.chunks(MAX_RTP_PAYLOAD_SIZE) {
        // Create the RTP header
        let mut rtp_header: [u8; RTP_HEADER_SIZE] = [0; RTP_HEADER_SIZE];
        rtp_header[0] = 0x80; // Version: 2
        rtp_header[1] = 96; // Payload Type: DynamicRTP-Type-96 (this can vary)
        rtp_header[2..4].copy_from_slice(&sequence_number.to_be_bytes());
        rtp_header[4..8].copy_from_slice(&timestamp.to_be_bytes());

        // Create an RTP packet
        let mut rtp_packet = Vec::with_capacity(RTP_HEADER_SIZE + chunk.len());
        rtp_packet.extend_from_slice(&rtp_header);
        rtp_packet.extend_from_slice(chunk);

        // Add the RTP packet to the list
        rtp_packets.push(rtp_packet);
    }

    if rtp_packets.is_empty() {
        error!("Failed to packetize the video frame.");
        return Err(PacketizeError::PacketizationError);
    }

    info!(
        "Successfully packetized the video frame into {} RTP packets.",
        rtp_packets.len()
    );

    Ok(rtp_packets)
}
