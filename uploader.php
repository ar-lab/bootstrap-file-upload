<?php

$outputDir = "/var/tmp";

if (!is_dir($outputDir)) {
    $mkdir = mkdir($outputDir, 0775);
}

$acceptedFileTypes = array(
    "application/x-tar",
    "application/x-gzip",
);

if (isset($_FILES["file"])) {
    // Filter the file types , if you want.
    if ($_FILES["file"]["error"] > 0) {
        echo '<span class="text-error">Error: ' . $_FILES["file"]["error"] . '</span><br>';
    } else {
        if (array_search($_FILES["file"]["type"], $acceptedFileTypes) !== false) {
            // move the uploaded file to uploads folder;
            $moveResult = move_uploaded_file($_FILES["file"]["tmp_name"], $outputDir . '/' . $_FILES["file"]["name"]);
            if ($moveResult) {
                echo '<span class="text-success">File uploaded successfully</span>';
            } else {
                echo '<span class="text-error">Error: Directory does not exist</span>';
            }
        } else {
            echo '<span class="text-error">Error: Wrong File Format</span>';
        }
    }

} else {
    echo '<span class="text-error">Error: File not uploaded</span>';
}