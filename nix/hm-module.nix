# Home-manager module for REMA voice assistant
#
# Provides a systemd user service for autostart.
# Usage: imports = [ rema.homeManagerModules.default ];
#        services.rema.enable = true;
{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.rema;
in
{
  options.services.rema = {
    enable = lib.mkEnableOption "REMA voice assistant user service";

    package = lib.mkOption {
      type = lib.types.package;
      defaultText = lib.literalExpression "rema.packages.\${system}.rema";
      description = "The REMA package to use.";
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.user.services.rema = {
      Unit = {
        Description = "REMA voice assistant";
        After = [ "graphical-session.target" ];
        PartOf = [ "graphical-session.target" ];
      };
      Service = {
        ExecStart = "${cfg.package}/bin/rema";
        Restart = "on-failure";
        RestartSec = 5;
      };
      Install.WantedBy = [ "graphical-session.target" ];
    };
  };
}
