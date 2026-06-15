/**
 * 위드아크 갈등관리 유형 진단 — 결과 수집 백엔드 (Google Apps Script)
 * ─────────────────────────────────────────────────────────────
 * 설치: 결과를 모을 구글 시트 → 확장 프로그램 → Apps Script →
 *       기존 코드를 모두 지우고 이 코드를 붙여넣은 뒤 저장 →
 *       배포 → 새 배포 → 유형: 웹 앱 →
 *       실행: 나 / 액세스 권한: 모든 사용자 → 배포 →
 *       나오는 웹 앱 URL(.../exec)을 HTML 파일의 SHEET_API 에 붙여넣기.
 *
 * ※ 코드를 수정했다면 [배포 > 배포 관리 > 편집 > 버전: 새 버전]으로 다시 배포해야 반영됩니다.
 */

const SHEET_NAME = 'results';   // 결과가 쌓일 시트 탭 이름 (자동 생성됨)
const API_KEY    = 'withark';   // HTML 파일의 API_KEY 와 반드시 동일하게 맞추세요

/* 참여자 결과 읽기 (JSONP) */
function doGet(e){
  const cb = e.parameter.callback;
  if(e.parameter.key !== API_KEY){
    return respond_({ ok:false, error:'unauthorized' }, cb);
  }
  return respond_({ ok:true, results: readAll_() }, cb);
}

/* 결과 저장 / 초기화 */
function doPost(e){
  let data = {};
  try { data = JSON.parse(e.postData.contents); }
  catch(err){ return text_('bad-json'); }

  if(data.key !== API_KEY) return text_('unauthorized');

  if(data.action === 'clear'){ clearAll_(); return text_('cleared'); }
  if(!data.id) return text_('skip');

  appendRow_(data);
  return text_('saved');
}

/* ───────── helpers ───────── */
function sheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if(!sh){
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id','이름','팀','경쟁','협력','타협','회피','수용','대표유형','응답시각']);
  }
  return sh;
}

function appendRow_(d){
  const s = d.scores || {};
  sheet_().appendRow([
    d.id || '', d.name || '', d.team || '',
    s.comp || 0, s.collab || 0, s.compr || 0, s.avoid || 0, s.accom || 0,
    (d.dominant || []).join('/'),
    d.ts || new Date().toISOString()
  ]);
}

function readAll_(){
  const v = sheet_().getDataRange().getValues();
  const out = [];
  for(let i = 1; i < v.length; i++){
    const r = v[i];
    if(!r[0] && !r[1]) continue;
    out.push({
      id:   String(r[0]),
      name: String(r[1]),
      team: String(r[2] || ''),
      scores: {
        comp:  Number(r[3]) || 0,
        collab:Number(r[4]) || 0,
        compr: Number(r[5]) || 0,
        avoid: Number(r[6]) || 0,
        accom: Number(r[7]) || 0
      },
      ts: r[9] ? new Date(r[9]).toISOString() : new Date().toISOString()
    });
  }
  return out;
}

function clearAll_(){
  const sh = sheet_();
  const last = sh.getLastRow();
  if(last > 1) sh.deleteRows(2, last - 1);  // 헤더만 남기고 모두 삭제
}

function respond_(obj, cb){
  const json = JSON.stringify(obj);
  if(cb){
    return ContentService.createTextOutput(cb + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(msg){
  return ContentService.createTextOutput(msg)
    .setMimeType(ContentService.MimeType.TEXT);
}
