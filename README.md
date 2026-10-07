# personal-english

나만을 위한 영어 공부 앱.

## 왜 만드는가

3년 동안 Duolingo를 매일 3개씩 했다. 영어가 조금은 는 것 같지만, 여러 문장을 이어서 들으면 중간중간 무슨 말인지 이해가 안 된다.

왜 그런지 이유를 모르겠다. 같은 내용을 글자로 읽으면 이해가 될 때도 있고, 읽어도 안 될 때도 있다. 이해가 안 될 때는 보통 아래 중 하나다.

- 단어를 모른다
- 문장 구조가 특이하다
- 소리가 잘 안 들린다

Duolingo는 매일 문제를 푸는 습관은 만들어 줬지만, 문장이 이어질 때 어디서 이해가 끊기는지는 알려 주지 않는다. 이 앱은 그 끊기는 지점이 단어인지, 문장 구조인지, 소리인지를 구분하고, 그 부분을 다시 연습하기 위해 만든다.

## MVP v0 상태

**MVP v0 완료** (`main`, [docs/MVP.md §6](docs/MVP.md#6-완료-기준-프로젝트-mvp)): 로컬 실행, S0~S6 UI, Dexie에 끊김·태그 유지, Playwright smoke E2E. 배포·홈 7일 통계·미니 연습(S5) 등은 이후 이슈.

## 문서

- [MVP: 하루 1세션 시나리오](docs/MVP.md)
- [기술·설계 결정 (언어/프레임워크)](docs/TECH_DECISIONS.md)
- [작업 프로세스 (이슈 → PR)](docs/WORKFLOW.md)

## 로컬 실행

[pnpm](https://pnpm.io/)이 필요합니다.

```bash
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 연다.

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm build         # 프로덕션 빌드
pnpm test:e2e      # Playwright E2E (로컬: dev 서버 자동 기동)
```

E2E smoke는 `e2e/session-smoke.spec.ts` — 홈 → 세션 → 끊김+태그 → 요약 (MVP S0~S6).

## 시드 passage (1~3)

전사·메타데이터는 [`content/seed-passages.json`](content/seed-passages.json)에 있고, 오디오는 `public/audio/`에 둔다. **UTC 날짜** 기준으로 passage가 하루에 하나씩 로테이션된다 (`lib/seed/daily-passage.ts`).

낭독 mp3를 다시 만들 때 (Google TTS, `pip install gTTS`):

```bash
python3 scripts/generate-seed-audio.py
```

## 개발 프로세스

이슈 → 브랜치 → PR → (merge 시 이슈 close 및 브랜치 삭제). 자세한 절차는 [docs/WORKFLOW.md](docs/WORKFLOW.md)를 참고한다.
