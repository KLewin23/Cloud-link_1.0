import request from "request";
import store from '../../store'
import {addGames, clGameCheckComplete} from "../../store/actions";

export default function getGoogleFolderChildren(token, auth, parent) {
    request.get(
        `https://www.googleapis.com/drive/v3/files?fields=nextPageToken,files(parents,mimeType,name,id,trashed,explicitlyTrashed)&pageToken=${token}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            },
            json: true
        },
        (err, response) => {
            if (err) {
                throw err;
            } else {
                const body = response.body;
                const children = body.files.filter(
                    file =>
                        Object.keys(file).includes("parents") &&
                        file.parents[0] === parent &&
                        file.trashed === false &&
                        file.explicitlyTrashed === false
                );
                store.dispatch(addGames(children));
                store.dispatch(clGameCheckComplete())
                if(Object.keys(response.body).includes('nextPageToken')){
                    getGoogleFolderChildren(response.body.nextPageToken,auth,parent)
                }
            }
        }
    );
}
