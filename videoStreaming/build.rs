fn main() {
    // Set the library directory where vcpkg installed FFmpeg
    println!("cargo:rustc-link-search=native=C:/Users/utsar/vcpkg/installed/x64-windows/lib");

    // Set the library to link with the Rust project
    println!("cargo:rustc-link-lib=static=avcodec");
    println!("cargo:rustc-link-lib=static=avutil");
    println!("cargo:rustc-link-lib=static=avformat");
    // Add more FFmpeg libraries as needed...

    // Set the include path for FFmpeg headers
    let ffmpeg_include = "C:/Users/utsar/vcpkg/installed/x64-windows/include";
    println!("cargo:include={}", ffmpeg_include);

    // Optional: Rebuild the project if the FFmpeg libraries change
    println!("cargo:rerun-if-changed={}/libavcodec", ffmpeg_include);
    println!("cargo:rerun-if-changed={}/libavutil", ffmpeg_include);
    println!("cargo:rerun-if-changed={}/libavformat", ffmpeg_include);
    // Add more FFmpeg libraries as needed...
}
