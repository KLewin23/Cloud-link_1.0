import request from "request";

export default function getGoogleFileContents(fileId, auth, callback) {
    request.get(
        `https://www.googleapis.com/drive/v2/files/${fileId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            },
            json: true
        },
        (err, response) => {
            if (err) throw err;
            if (response.body.downloadUrl) {
                const accessToken = auth;
                const xhr = new XMLHttpRequest();
                xhr.open("GET", response.body.downloadUrl);
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
                xhr.onload = function() {
                    callback(xhr.responseText);
                };
                xhr.onerror = function() {
                    callback(null);
                };
                xhr.send();
            } else {
                callback(null);
            }
        }
    );
}
