# 작업 프로세스

모든 기능·문서·인프라 변경은 **이슈 → 브랜치 → PR → 정리** 순서로 진행한다.

## 1. 이슈 생성

- GitHub Issues에 작업 단위로 이슈를 만든다.
- 제목은 **무엇을 / 왜**가 드러나게 작성한다.
- 본문에는 목적, 완료 조건(체크리스트), 범위 밖 항목을 적는다.
- 저장소 템플릿: **New issue → Task** 사용.

## 2. 브랜치 생성 및 PR

- 이슈 번호를 확인한 뒤, **이슈 전용 브랜치**를 만든다.
- 브랜치 이름 (Cloud Agent / 팀 convention):

  ```text
  cursor/<짧은-영문-설명>-de6c
  ```

  예: `cursor/add-listening-session-mvp-de6c`

- `main`에서 분기하고, 커밋 후 원격에 push한다.

  ```bash
  git checkout main
  git pull origin main
  git checkout -b cursor/<description>-de6c
  # ... 작업 ...
  git push -u origin cursor/<description>-de6c
  ```

- PR은 **draft**로 열어도 되며, base는 `main`이다.
- PR 본문 **맨 위**에 이슈 자동 종료 키워드를 넣는다 (merge 시 이슈 close):

  ```text
  Fixes #123
  ```

  또는 `Closes #123`, `Resolves #123`.

- PR 설명에는 변경 요약, 테스트 방법, 스크린샷(UI 변경 시)을 포함한다.

## 3. PR 종료와 이슈 close

- 리뷰 후 **Merge** (또는 squash merge)하면, PR 본문의 `Fixes #N` 때문에 **연결된 이슈가 자동으로 closed** 된다.
- merge 없이 PR만 close하는 경우 이슈는 자동으로 닫히지 않으므로, 의도적으로 abandon할 때만 PR만 닫는다.

## 4. 브랜치 삭제

- merge된 feature 브랜치는 **삭제**한다.
- 저장소 설정 **Automatically delete head branches** 를 켜 두면 merge 후 GitHub가 head 브랜치를 제거한다.
- 로컬 정리:

  ```bash
  git checkout main
  git pull origin main
  git branch -d cursor/<description>-de6c
  git fetch --prune
  ```

## 한 작업 = 한 이슈 = 한 브랜치 = 한 PR

- 여러 이슈를 한 PR에 묶지 않는다 (예외: tightly coupled 작업은 사전에 이슈에 명시).
- 큰 기능은 이슈를 쪼개고, 각각 2~4단계를 반복한다.

## Cursor Cloud Agent

- Agent도 동일 프로세스를 따른다: **먼저 이슈 생성 → 해당 브랜치에서 구현 → PR에 `Fixes #N` → merge 후 브랜치 삭제**.
