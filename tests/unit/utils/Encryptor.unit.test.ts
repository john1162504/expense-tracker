import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

vi.mock("bcrypt", () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "@/utils/Encryptor";

describe("Encryptor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("hashPassword", () => {
        it("hashes password with correct salt rounds", async () => {
            (bcrypt.hash as Mock).mockResolvedValue("hashed");

            const result = await hashPassword("plain");

            expect(bcrypt.hash).toHaveBeenCalledWith("plain", 5);
            expect(result).toBe("hashed");
        });

        it("propagates bcrypt errors", async () => {
            (bcrypt.hash as Mock).mockRejectedValue(new Error("bcrypt error"));

            await expect(hashPassword("plain")).rejects.toThrow("bcrypt error");
        });
    });

    describe("comparePassword", () => {
        it("returns true when passwords match", async () => {
            (bcrypt.compare as Mock).mockResolvedValue(true);

            const result = await comparePassword("plain", "hashed");

            expect(bcrypt.compare).toHaveBeenCalledWith("plain", "hashed");
            expect(result).toBe(true);
        });

        it("returns false when passwords do not match", async () => {
            (bcrypt.compare as Mock).mockResolvedValue(false);

            const result = await comparePassword("plain", "hashed");

            expect(result).toBe(false);
        });
    });
});
