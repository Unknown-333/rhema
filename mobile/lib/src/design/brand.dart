// The RHEMA mark and wordmark, drawn rather than shipped as images so they
// stay sharp at every size and need no asset.

import 'package:flutter/material.dart';

import 'tokens.dart';

/// The dot-wave mark: a waveform that settles into a line of text and ends in
/// a red cursor, white on the black tile. Same bitmap as `brand/bitmaps.mjs`
/// (`MARK`) and `src/components/Logo.tsx`, on its 1024 grid.
class RhemaMark extends StatelessWidget {
  const RhemaMark({super.key, this.size = 32, this.tile = true});

  final double size;

  /// Draw the black tile behind the dots; without it the dots take the
  /// current icon colour.
  final bool tile;

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: CustomPaint(
        size: Size.square(size),
        painter: _MarkPainter(
          tile: tile,
          ink: tile ? Colors.white : IconTheme.of(context).color ?? Colors.white,
        ),
      ),
    );
  }
}

class _MarkPainter extends CustomPainter {
  const _MarkPainter({required this.tile, required this.ink});

  final bool tile;
  final Color ink;

  static const _rows = [
    '....#......',
    '..#.##....R',
    '.######...R',
    '#########.R',
    '.######...R',
    '..#.##....R',
    '....#......',
  ];
  static const _pitch = 68.0;
  static const _radius = 26.0;
  static const _signal = Color(0xFFFF4D3A);

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 1024;
    canvas.scale(s);
    if (tile) {
      const rect = Rect.fromLTWH(32, 32, 960, 960);
      canvas.drawRRect(
        RRect.fromRectAndRadius(rect, const Radius.circular(211)),
        Paint()..color = Colors.black,
      );
    }
    final cols = _rows.first.length;
    final x0 = (1024 - cols * _pitch) / 2;
    final y0 = (1024 - _rows.length * _pitch) / 2;
    final inkPaint = Paint()..color = ink;
    final signalPaint = Paint()..color = _signal;
    for (var y = 0; y < _rows.length; y++) {
      for (var x = 0; x < cols; x++) {
        final cell = _rows[y][x];
        if (cell == '.') continue;
        canvas.drawCircle(
          Offset(x0 + _pitch / 2 + x * _pitch, y0 + _pitch / 2 + y * _pitch),
          _radius,
          cell == 'R' ? signalPaint : inkPaint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(_MarkPainter old) => old.tile != tile || old.ink != ink;
}

/// The name as the logo sets it: tight and heavy.
class Wordmark extends StatelessWidget {
  const Wordmark({super.key, this.size = 22, this.color});

  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) => Text(
    'RHEMA',
    style: TextStyle(
      fontFamily: RhemaFonts.display,
      fontWeight: FontWeight.w800,
      fontSize: size,
      height: 1,
      letterSpacing: 0.04 * size,
      color: color ?? context.rhema.ink,
    ),
  );
}

/// The mark beside the wordmark; its cap height is 60% of the mark's.
class LogoLockup extends StatelessWidget {
  const LogoLockup({super.key, this.size = 28});

  final double size;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'RHEMA',
    excludeSemantics: true,
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        RhemaMark(size: size),
        SizedBox(width: size * 0.3),
        Wordmark(size: size * 0.82),
      ],
    ),
  );
}
