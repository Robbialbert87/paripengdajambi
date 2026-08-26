<?php

namespace App\Http\Controllers;

use chillerlan\QRCode\{QRCode, QROptions};
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Output\QRGdImagePNG;
use Illuminate\Http\Response;

class QrCodeController extends Controller
{
    public function __invoke(string $id): Response
    {
        $url = config('app.url') . '/verifikasi/' . $id;

        $options = new QROptions([
            'outputInterface' => QRGdImagePNG::class,
            'eccLevel'        => EccLevel::H,
            'scale'           => 10,
            'imageBase64'     => false,
            'bgColor'         => [255, 255, 255],
            'drawLightModules' => true,
        ]);

        $imageData = (new QRCode($options))->render($url);

        return response($imageData)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'no-cache, must-revalidate');
    }
}
