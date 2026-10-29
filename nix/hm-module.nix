# Home-manager module for RHEMA voice assistant
#
# Provides a systemd user service for autostart.
# Usage: imports = [ rhema.homeManagerModules.default ];
#        services.rhema.enable = true;
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.rhema;
in
{
  options.services.rhema = {
    enable = lib.mkEnableOption "RHEMA voice assistant user service";

    package = lib.mkOption {
      type = lib.types.package;
      defaultText = lib.literalExpression "rhema.packages.\${system}.rhema";
      description = "The RHEMA package to use.";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.user.services.rhema = {
      Unit = {
        Description = "RHEMA voice assistant";
        After = [ "graphical-session.target" ];
        PartOf = [ "graphical-session.target" ];
      };
      Service = {
        ExecStart = "${cfg.package}/bin/rhema";
        Restart = "on-failure";
        RestartSec = 5;
      };
      Install.WantedBy = [ "graphical-session.target" ];
    };
  };
}
