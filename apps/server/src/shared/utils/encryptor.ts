import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 5;

async function hashPassword(plainPassword: string): Promise<string> {
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashed;
}

async function compareHashed(
    unhashed: string,
    hashed: string,
): Promise<boolean> {
    return (
        (await bcrypt.compare(unhashed, hashed)) ||
        crypto.createHash("sha256").update(unhashed).digest("hex") === hashed
    );
}

async function hashToken(token: string): Promise<string> {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export { hashPassword, compareHashed, hashToken };
