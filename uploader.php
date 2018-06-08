<?php

$fileKey = isset($_POST['fileKey']) ? $_POST['fileKey'] : 'file';
$fileTypes = isset($_POST['fileTypes']) ? $_POST['fileTypes'] : '';
$outputDir = isset($_POST['directory']) ? $_POST['directory'] : '/var/tmp';

if (!empty($fileTypes)) {
    $acceptedFileTypes = explode(',', $fileTypes);
}

if (!is_dir($outputDir) && !mkdir($outputDir, 0775)) {
    exit('<span class="text-error">Error: Could not create destination directory ' . $outputDir . '</span>');
}

// ----------------------------------------------------------------------

if (!isset($_FILES) || !isset($_FILES[$fileKey])) {
    exit('<span class="text-error">Error: File not received</span>');
}

if ($_FILES[$fileKey]['size'] === 0 && $_FILES[$fileKey]['tmp_name'] === 'none') {
    exit('<span class="text-error">Error: File not selected</span>');
}

if ($_FILES[$fileKey]["error"] !== UPLOAD_ERR_OK) {
    exit('<span class="text-error">Error: File not uploaded (code ' . $_FILES[$fileKey]["error"] . ')</span><br>');
}

if (isset($acceptedFileTypes) && array_search($_FILES[$fileKey]["type"], $acceptedFileTypes) === false) {
    exit('<span class="text-error">Error: Wrong File Format</span>');
}

// ----------------------------------------------------------------------

$uploadResult = move_uploaded_file($_FILES[$fileKey]["tmp_name"], $outputDir . DIRECTORY_SEPARATOR . $_FILES[$fileKey]["name"]);

if ($uploadResult) {
    echo '<span class="text-success">File uploaded successfully</span>';
} else {
    echo '<span class="text-error">Error: Directory access failed</span>';
}