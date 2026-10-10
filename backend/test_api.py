"""
Quick smoke-test script for TNPlasticHub API.
Run: python test_api.py
"""
import sys
import json
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8001"
PASS = 0
FAIL = 0


def req(method, path, body=None, token=None, expect=None):
    global PASS, FAIL
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            status = resp.status
            content = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        status = e.code
        try:
            content = json.loads(e.read())
        except Exception:
            content = {}

    label = f"{method} {path}"
    ok = (expect is None) or (status == expect)
    symbol = "PASS" if ok else "FAIL"
    if ok:
        PASS += 1
    else:
        FAIL += 1
    print(f"  [{symbol}] {status} {label}")
    if not ok:
        print(f"         Expected {expect}, got {status}. Body: {str(content)[:200]}")
    return status, content


print("\n=== TNPlasticHub API Smoke Tests ===\n")

# ── Health ────────────────────────────────────────────────────────────────────
print("[Health]")
req("GET", "/health", expect=200)
req("GET", "/health/db", expect=200)

# ── Auth ──────────────────────────────────────────────────────────────────────
print("\n[Auth]")
_, reg = req("POST", "/api/auth/register", {
    "email": "smoketest@tnplastic.in", "password": "Smoke1234",
    "full_name": "Smoke Tester", "role": "student"
}, expect=None)  # 201 first run, 409 on re-run – both acceptable
if reg.get("id"):
    user_email, user_pass = "smoketest@tnplastic.in", "Smoke1234"
else:
    import time
    user_email = f"smoketest{int(time.time())}@tnplastic.in"
    user_pass = "Smoke1234"
    _, reg = req("POST", "/api/auth/register", {
        "email": user_email, "password": user_pass,
        "full_name": "Smoke Tester", "role": "student"
    }, expect=201)

_, login = req("POST", "/api/auth/login", {
    "email": user_email, "password": user_pass
}, expect=200)
token = login.get("access_token", "")

_, me = req("GET", "/api/auth/me", token=token, expect=200)
req("GET", "/api/users/me", token=token, expect=200)

# ── Companies ─────────────────────────────────────────────────────────────────
print("\n[Companies]")
req("GET", "/api/companies", expect=200)
req("GET", "/api/companies?status=verified&page=1&page_size=5", expect=200)

# ── Internships ───────────────────────────────────────────────────────────────
print("\n[Internships]")
req("GET", "/api/internships", expect=200)
req("GET", "/api/internships?search=plastic&page=1", expect=200)

# ── Industrial Visits ─────────────────────────────────────────────────────────
print("\n[Industrial Visits]")
req("GET", "/api/industrial-visits", expect=200)
req("GET", "/api/industrial-visits/my-bookings", token=token, expect=200)

# ── Applications ─────────────────────────────────────────────────────────────
print("\n[Applications]")
req("GET", "/api/applications/my", token=token, expect=200)
req("GET", "/api/applications/me", token=token, expect=200)  # both aliases work

# ── Industry Resources ────────────────────────────────────────────────────────
print("\n[Industry Resources]")
req("GET", "/api/schemes", expect=200)
req("GET", "/api/loans", expect=200)
req("GET", "/api/contacts", token=token, expect=200)  # public
req("GET", "/api/associations", expect=200)

# ── News & Technologies ───────────────────────────────────────────────────────
print("\n[News & Technologies]")
req("GET", "/api/news", expect=200)
req("GET", "/api/technologies", expect=200)

# ── Admin ─────────────────────────────────────────────────────────────────────
print("\n[Admin – expect 403 for student token]")
req("GET", "/api/admin/dashboard", token=token, expect=403)
req("GET", "/api/admin/pending-verifications", token=token, expect=403)

# ── AI Chat ───────────────────────────────────────────────────────────────────
print("\n[AI Chat]")
_, chat1 = req("POST", "/api/ai/chat", {
    "message": "What is injection moulding?"
}, token=token, expect=200)
print(f"         conversation_id: {chat1.get('conversation_id','?')[:8]}...")
print(f"         confidence: {chat1.get('confidence','?')}")
print(f"         sources: {len(chat1.get('sources',[]))}")

convo_id = chat1.get("conversation_id")
if convo_id:
    # Multi-turn: second message in same conversation
    _, chat2 = req("POST", "/api/ai/chat", {
        "message": "How does it compare to extrusion?",
        "conversation_id": convo_id
    }, token=token, expect=200)
    print(f"         second turn conversation_id: {chat2.get('conversation_id','?')[:8]}... (same={convo_id[:8]==chat2.get('conversation_id','?')[:8]})")

# Conversation history
req("GET", "/api/ai/conversations", token=token, expect=200)
if convo_id:
    req("GET", f"/api/ai/conversations/{convo_id}", token=token, expect=200)

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n=== Results: {PASS} passed, {FAIL} failed ===")
sys.exit(0 if FAIL == 0 else 1)
