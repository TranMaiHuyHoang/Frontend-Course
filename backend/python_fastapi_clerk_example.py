"""
=============================================================================
Ví dụ hoàn chỉnh: Python Backend (FastAPI) xác thực Clerk Session Token
=============================================================================
Hướng dẫn luồng hoạt động:
1. Frontend (Next.js) lấy Session Token từ Clerk:
   const token = await getToken();
2. Gửi request kèm Header:
   Authorization: Bearer <token>
3. Python FastAPI trích xuất Bearer token, lấy Public Key JWKS từ Clerk và
   xác thực chữ ký JWT token.
4. Lấy thông tin user (user_id, email, ...) và cho phép truy cập API.

Cài đặt thư viện cần thiết:
    pip install fastapi uvicorn PyJWT[crypto] requests cryptography

Chạy server FastAPI:
    uvicorn python_fastapi_clerk_example:app --reload --port 8000
=============================================================================
"""

import os
from typing import Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

app = FastAPI(title="Clerk Auth Python FastAPI Verification Example")

# 1. Cấu hình Clerk (Lấy từ Clerk Dashboard -> API Keys hoặc JWKS URL)
# Ví dụ: CLERK_PEM_PUBLIC_KEY hoặc JWKS URL từ Clerk Frontend API
CLERK_PEM_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY", "")
# Hoặc Clerk Frontend API / JWKS: e.g. "https://clerk.your-domain.com/.well-known/jwks.json"
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")

security = HTTPBearer()

def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict[str, Any]:
    """
    Dependency FastAPI để kiểm tra và xác thực JWT token từ Clerk.
    Trả về payload chứa user_id (sub), session_id (sid), email,...
    """
    token = credentials.credentials
    try:
        # Cách 1: Xác thực qua Clerk PEM Public Key (nếu cấu hình)
        if CLERK_PEM_PUBLIC_KEY:
            formatted_key = (
                CLERK_PEM_PUBLIC_KEY
                if "-----BEGIN PUBLIC KEY-----" in CLERK_PEM_PUBLIC_KEY
                else f"-----BEGIN PUBLIC KEY-----\n{CLERK_PEM_PUBLIC_KEY}\n-----END PUBLIC KEY-----"
            )
            payload = jwt.decode(
                token,
                formatted_key,
                algorithms=["RS256"]
            )
            return payload

        # Cách 2: Xác thực qua JWKS endpoint của Clerk
        elif CLERK_JWKS_URL:
            jwks_client = PyJWKClient(CLERK_JWKS_URL)
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"]
            )
            return payload

        else:
            # Fallback chế độ dev/giải mã unverified payload (để test khi chưa có key)
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            return unverified_payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã hết hạn. Vui lòng đăng nhập lại qua Clerk."
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token không hợp lệ: {str(e)}"
        )


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Python FastAPI Clerk Service"}


@app.get("/api/auth/me")
def get_current_user(token_payload: dict = Depends(verify_clerk_token)):
    """
    Endpoint lấy thông tin User đã xác thực qua Google / Clerk
    """
    user_id = token_payload.get("sub")
    session_id = token_payload.get("sid")
    
    return {
        "success": True,
        "message": "Token xác thực thành công từ Python FastAPI Backend",
        "data": {
            "userId": user_id,
            "sessionId": session_id,
            "tokenClaims": token_payload
        }
    }


@app.get("/api/courses/protected")
def get_protected_courses(user: dict = Depends(verify_clerk_token)):
    """
    Endpoint chỉ cho phép truy cập sau khi login Google
    """
    return {
        "success": True,
        "message": f"Xin chào User {user.get('sub')}, bạn có quyền truy cập dữ liệu bảo vệ!"
    }
