fn main() {
  let manifest = include_str!("win10.manifest");
  println!("cargo:rerun-if-changed=win10.manifest");
  let windows = tauri_build::WindowsAttributes::new().app_manifest(manifest);
  let attrs = tauri_build::Attributes::new().windows_attributes(windows);
  tauri_build::try_build(attrs).expect("failed to run tauri build script");
}
