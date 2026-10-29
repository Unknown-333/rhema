//! Environment variables a user sets by hand (`NO_GTK_LAYER_SHELL`,
//! `ALLOW_WAYLAND`, `KEEP_VULKAN_IMPLICIT_LAYERS`, `METAL_RESIDENCY`), read by
//! their name without the app's prefix.

/// Prefix of the environment variables the app reads.
pub const ENV_PREFIX: &str = "RHEMA_";

/// The variable `RHEMA_<suffix>`, if it is set.
pub fn user_env_var_os(suffix: &str) -> Option<std::ffi::OsString> {
    read_prefixed(suffix, |name| std::env::var_os(name))
}

/// [`user_env_var_os`] as UTF-8; a value that is not UTF-8 reads as unset.
pub fn user_env_var(suffix: &str) -> Option<String> {
    user_env_var_os(suffix).and_then(|value| value.into_string().ok())
}

fn read_prefixed<T>(suffix: &str, read: impl Fn(&str) -> Option<T>) -> Option<T> {
    read(&format!("{ENV_PREFIX}{suffix}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_the_prefixed_name_only() {
        let env = |name: &str| (name == "RHEMA_ALLOW_WAYLAND").then(|| "1".to_string());
        assert_eq!(read_prefixed("ALLOW_WAYLAND", env), Some("1".to_string()));
        assert_eq!(read_prefixed("ALLOW_WAYLAND", |_| None::<String>), None);
        assert_eq!(read_prefixed("OTHER", env), None);
    }
}
