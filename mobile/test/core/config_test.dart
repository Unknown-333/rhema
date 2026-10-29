import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:rhema_mobile/src/core/config.dart';

void main() {
  test('a release build ignores RHEMA_SERVER_URL: discovery only', () {
    expect(pinnedServerUrl(release: true), isNull);
    // These tests are built without the define.
    expect(pinnedServerUrl(release: false), isNull);
  });

  test('appVersion matches pubspec.yaml', () {
    final version = RegExp(
      r'^version: ([^+\s]+)',
      multiLine: true,
    ).firstMatch(File('pubspec.yaml').readAsStringSync())!.group(1);
    expect(appVersion, version);
  });
}
