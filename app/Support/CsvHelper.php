<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvHelper
{
    /**
     * @param  list<string>  $headers
     * @param  list<list<string>>  $sampleRows
     */
    public static function download(string $filename, array $headers, array $sampleRows = []): StreamedResponse
    {
        return response()->streamDownload(
            static function () use ($headers, $sampleRows): void {
                $handle = fopen('php://output', 'w');

                if ($handle === false) {
                    return;
                }

                fwrite($handle, "\xEF\xBB\xBF");
                fputcsv($handle, $headers, ';');

                foreach ($sampleRows as $row) {
                    fputcsv($handle, $row, ';');
                }

                fclose($handle);
            },
            $filename,
            ['Content-Type' => 'text/csv; charset=UTF-8']
        );
    }

    /**
     * Membaca file CSV menjadi baris-baris asosiatif berdasarkan kolom kanonik.
     *
     * @param  array<string, list<string>>  $aliases  peta kolom kanonik => nama header alternatif (huruf kecil)
     * @return list<array<string, string>>
     */
    public static function read(UploadedFile $file, array $aliases): array
    {
        $handle = fopen($file->getPathname(), 'r');

        if ($handle === false) {
            throw new InvalidArgumentException('Tidak dapat membuka file CSV.');
        }

        $firstLine = fgets($handle);

        if ($firstLine === false) {
            fclose($handle);

            throw new InvalidArgumentException('File CSV kosong.');
        }

        $delimiter = substr_count($firstLine, ';') >= substr_count($firstLine, ',') ? ';' : ',';

        rewind($handle);

        $header = fgetcsv($handle, null, $delimiter);

        if ($header === false) {
            fclose($handle);

            throw new InvalidArgumentException('File CSV tidak memiliki baris kepala.');
        }

        $header[0] = (string) preg_replace('/^\xEF\xBB\xBF/', '', (string) $header[0]);

        $columnMap = [];

        foreach ($header as $index => $cell) {
            $key = strtolower(trim((string) $cell));

            foreach ($aliases as $canonical => $names) {
                if (in_array($key, $names, true)) {
                    $columnMap[$canonical] = $index;

                    break;
                }
            }
        }

        $rows = [];

        while (($line = fgetcsv($handle, null, $delimiter)) !== false) {
            $row = [];

            foreach ($columnMap as $canonical => $index) {
                $row[$canonical] = trim((string) ($line[$index] ?? ''));
            }

            if ($row !== [] && array_filter($row, static fn (string $value): bool => $value !== '') !== []) {
                $rows[] = $row;
            }
        }

        fclose($handle);

        return $rows;
    }
}
