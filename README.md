# 갈등관리 유형 진단 (TKI 기반)

위드아크(WithArk) 팀빌딩 워크숍용 갈등관리 유형 진단 웹앱입니다.
토마스–킬만(Thomas–Kilmann) 갈등관리 모델 — **자기주장 × 협력**의 2축, 5가지 유형(경쟁·협력·타협·회피·수용) — 을 바탕으로 자체 제작했습니다. (실제 TKI® 문항은 사용하지 않고 이론 모델만 활용)

## 구성 파일

| 파일 | 설명 |
|---|---|
| `index.html` | 진단 웹앱 (참여자 검사 + 진행자 집계 대시보드) |
| `apps_script.gs` | 결과 수집 백엔드 (Google Apps Script) |
| `README.md` | 이 문서 |

## 주요 기능

- 30문항 양자택일 진단 · 진행률 표시 · 뒤로 가기
- **개인 결과**: 대표 유형, 강점 / 주의점, 5유형 점수, 갈등 좌표(2축 시각화), 유연성 진단
- **진행자 집계**: 대표 유형 분포, 팀 평균, 팀 좌표, 자동 인사이트, 워크숍 토론 질문, 참여자별 상세표, CSV 내보내기, 데이터 초기화
- **참여자 / 진행자 화면 분리**: 진행자만 주소 뒤 `?admin` + 비밀번호로 대시보드 진입

## 배포 방법

### 1단계 · 백엔드 (구글 시트 연동, 집계용)

1. 결과를 모을 구글 시트 생성 → **확장 프로그램 → Apps Script**
2. `apps_script.gs` 내용을 붙여넣고 저장
3. **배포 → 새 배포 → 유형: 웹 앱**, 실행: 나, 액세스 권한: **모든 사용자** → 배포
4. 발급된 웹 앱 URL(`.../exec`로 끝남) 복사
5. `index.html` 상단의 `const SHEET_API = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';` 에서 따옴표 안을 복사한 URL로 교체

> 코드를 수정하면 **배포 → 배포 관리 → 편집 → 버전: 새 버전**으로 다시 배포해야 반영됩니다.

### 2단계 · 호스팅 (GitHub Pages)

1. 이 저장소를 GitHub에 푸시
2. 저장소 **Settings → Pages**
3. Source: **Deploy from a branch** → `main` / `/ (root)` → **Save**
4. 잠시 후 `https://<계정>.github.io/<저장소>/` 에서 공개

> 또는 [Netlify Drop](https://app.netlify.com/drop)에 `index.html`을 끌어다 놓으면 즉시 링크가 생성됩니다.

## 사용 링크

- **참여자** → `https://.../` (진단 화면만 표시)
- **진행자** → `https://.../?admin` (비밀번호 입력 후 대시보드)

## 설정값 (`index.html` 상단)

| 변수 | 기본값 | 설명 |
|---|---|---|
| `SHEET_API` | (placeholder) | Apps Script 웹앱 URL |
| `API_KEY` | `withark` | 백엔드와 동일해야 함 (`apps_script.gs`의 `API_KEY`와 일치) |
| `ADMIN_PASS` | `withark` | 진행자 대시보드 비밀번호 |

## 주의

- 시트에 참여자 이름이 저장되고, 링크를 아는 사람은 결과를 조회할 수 있습니다. 민감한 개인정보는 입력하지 말고 워크숍 용도로만 사용하세요.
- `API_KEY`를 변경할 경우 `index.html`과 `apps_script.gs` 양쪽을 동일하게 맞춰야 합니다.

---

© WithArk · 시냇가에심은나무
