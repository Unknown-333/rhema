# NixOS module for RHEMA voice assistant
#
# Handles system-level configuration that the package wrapper cannot:
#   - udev rule for /dev/uinput (rdev grab() needs it for virtual input)
#
# Note: users must add themselves to the "input" group for evdev hotkey access.
#
# Usage in your flake:
#
#   inputs.rhema.url = "github:Unknown-333/rhema";
#
#   nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
#     modules = [
#       rhema.nixosModules.default
#       { programs.rhema.enable = true; }
#     ];
#   };
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.programs.rhema;
in
{
  options.programs.rhema = {
    enable = lib.mkEnableOption "RHEMA offline voice assistant";

    package = lib.mkOption {
      type = lib.types.package;
      defaultText = lib.literalExpression "rhema.packages.\${system}.rhema";
      description = "The RHEMA package to use.";
    };
  };

  config = lib.mkIf cfg.enable {
    environment.systemPackages = [ cfg.package ];

    # rdev grab() creates virtual input devices via /dev/uinput.
    # Default permissions are crw------- root root — open it to the input group.
    services.udev.extraRules = ''
      KERNEL=="uinput", GROUP="input", MODE="0660"
    '';
  };
}
