import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Resend before importing the route.
const sendMock = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}));

import { POST } from "./route";
import { HONEYPOT_FIELD } from "@/lib/contact";

function jsonRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = { nom: "Jean Dupont", email: "jean@example.com", message: "Bonjour, je souhaite adhérer au club." };

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "eml_1" }, error: null });
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO = "club@example.com";
  process.env.CONTACT_FROM = "contact@send.example.com";
});

describe("POST /api/contact", () => {
  it("honeypot filled → 200 and sends nothing", async () => {
    const res = await POST(jsonRequest({ ...valid, [HONEYPOT_FIELD]: "http://spam" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("valid submission → 200, sends plain-text email with reply-to", async () => {
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0][0];
    expect(arg.to).toBe("club@example.com");
    expect(arg.from).toBe("contact@send.example.com");
    expect(arg.replyTo).toBe("jean@example.com");
    expect(arg.text).toContain("Bonjour");
    expect(arg.html).toBeUndefined(); // plain text only
    expect(arg.subject).toBe("[SRTC contact] Jean Dupont");
  });

  it("strips newlines/control chars from the subject", async () => {
    await POST(jsonRequest({ ...valid, nom: "Jean\nDupont\rX" }));
    const arg = sendMock.mock.calls[0][0];
    expect(arg.subject).not.toMatch(/[\n\r]/);
    expect(arg.subject).toBe("[SRTC contact] Jean Dupont X");
  });

  it("message too short → 400 with field error", async () => {
    const res = await POST(jsonRequest({ ...valid, message: "court" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.message).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("invalid email → 400 with field error", async () => {
    const res = await POST(jsonRequest({ ...valid, email: "pas-un-email" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.email).toBeTruthy();
  });

  it("nom too long → 400", async () => {
    const res = await POST(jsonRequest({ ...valid, nom: "a".repeat(101) }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors.nom).toBeTruthy();
  });

  it("malformed JSON → 400", async () => {
    const res = await POST(jsonRequest("{ not json"));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("oversized body (content-length header) → 400", async () => {
    const res = await POST(jsonRequest(valid, { "content-length": String(20 * 1024) }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("oversized actual body → 400", async () => {
    const res = await POST(jsonRequest({ ...valid, message: "x".repeat(20 * 1024) }));
    expect(res.status).toBe(400);
  });

  it("missing env config → 500", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("Resend returns an error → 500", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "quota" } });
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(500);
  });

  it("Resend throws → 500", async () => {
    sendMock.mockRejectedValue(new Error("network"));
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(500);
  });
});
