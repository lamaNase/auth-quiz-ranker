import { distroyUserSession } from "~/data/users.server";


export async function action(request) {
    if(request.request.method !== "POST"){
        throw {mesage: "Invalid request method"};
    }

    return await distroyUserSession(request.request);
}