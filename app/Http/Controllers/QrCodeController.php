<?php

namespace App\Http\Controllers;

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Data\QRMatrix;
use chillerlan\QRCode\Output\QROutputInterface;
use Illuminate\Http\Response;

class QrCodeController extends Controller
{
    public function __invoke(string $id): Response
    {
        $url = config('app.url') . '/verifikasi/' . $id;

        $options = new QROptions([
            'version'          => QRCode::VERSION_AUTO,
            'outputType'       => QROutputInterface::GDIMAGE_PNG,
            'eccLevel'         => QRCode::ECC_H,
            'scale'            => 10,
            'imageBase64'      => false,
            'bgColor'          => [255, 255, 255],
            'drawLightModules' => true,
            'moduleValues'     => [
                QRMatrix::M_DATA_DARK  => [0, 0, 0],
                QRMatrix::M_FINDER_DARK => [0, 0, 0],
                QRMatrix::M_ALIGNMENT_DARK => [0, 0, 0],
                QRMatrix::M_TIMING_DARK => [0, 0, 0],
            ],
        ]);

        $qr = new QRCode($options);
        $imageData = $qr->render($url);

        return response($imageData)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'public, max-age=86400');
    }
}
