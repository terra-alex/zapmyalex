import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getToken() {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const response = await axios.post("https://api.pavlok.com/api/v5/users/login", {
        user: {
            email: "alexandre.venet@hotmail.com",
            password: "0q3n%ZY82i8^V#t9*#4q",
        },
    });

    if (response.status === 200) {
        const token = response.data.user.token;
        const expiry = JSON.parse(atob(token.split('.')[1])).exp * 1000;
        cachedToken = token;
        tokenExpiry = expiry;
        return token;
    } else {
        throw new Error("Failed to get token");
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { name, strength } = req.body;

    try {
        const token = await getToken();

        const response = await axios.post("https://api.pavlok.com/api/v5/stimulus/send", {
            stimulus: {
                stimulusType: "vibe",
                stimulusValue: strength,
                reason: name,
            },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            res.status(200).json({ message: "Zap delivered!" });
        } else {
            res.status(response.status).json({ error: "Failed to deliver zap." });
        }
    } catch (err) {
        res.status(500).json({ error: "An error occurred." });
    }
}
