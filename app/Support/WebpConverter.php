<?php

namespace App\Support;

use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class WebpConverter
{
    public const SIZE = 512;

    public static function convert(string $imageData): string
    {
        $source = @imagecreatefromstring($imageData);

        if ($source === false) {
            throw new InvalidArgumentException('Gambar tidak valid atau tidak didukung.');
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $side = min($width, $height);

        $cropX = intdiv($width - $side, 2);
        $cropY = intdiv($height - $side, 2);

        $square = imagecreatetruecolor(self::SIZE, self::SIZE);

        imagecopyresampled(
            $square,
            $source,
            0,
            0,
            $cropX,
            $cropY,
            self::SIZE,
            self::SIZE,
            $side,
            $side
        );

        imagedestroy($source);

        $path = 'struktur/'.Str::uuid()->toString().'.webp';
        $dir = storage_path('app/public/struktur');

        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            imagedestroy($square);

            throw new RuntimeException('Tidak dapat membuat direktori penyimpanan.');
        }

        $fullPath = $dir.DIRECTORY_SEPARATOR.basename($path);

        if (! @imagewebp($square, $fullPath, 100)) {
            imagedestroy($square);

            throw new RuntimeException('Gagal membuat gambar WebP.');
        }

        imagedestroy($square);

        return $path;
    }
}
