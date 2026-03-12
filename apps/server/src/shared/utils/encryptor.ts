import bcrypt from "bcrypt";

const SALT_ROUNDS = 5;

async function hashPassword(plainPassword: string): Promise<string> {
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashed;
}

async function compareHashed(
    unhashed: string,
    hashed: string,
): Promise<boolean> {
    return await bcrypt.compare(unhashed, hashed);
}

async function hashToken(token: string): Promise<string> {
    const hashed = await bcrypt.hash(token, SALT_ROUNDS);
    return hashed;
}

export { hashPassword, compareHashed, hashToken };
