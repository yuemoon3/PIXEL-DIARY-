"use strict";
let moodMonth=localDate().slice(0,7);
const moodEncouragement={happy:"把今天的小快樂，留給未來的自己。",calm:"平凡安穩的一天，也值得好好收藏。",okay:"不需要特別精彩，今天的你也很棒。",low:"今天辛苦了，先給自己一點溫柔。",tired:"慢一點也沒關係，留些時間休息。"};

function chooseMood(id) {
  $("moodValue").value=id;
  document.querySelectorAll(".mood-choice").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.mood===id)));
}
function loadMoodDate(date) {
  $("moodDate").value=date;
  const record=data.moods.find(r=>r.date===date);
  chooseMood(record?.mood||"");
  $("moodText").value=record?.text||"";
  $("moodSave").textContent=record?"♡ 更新這天的心情":"♡ 收藏這天的心情";
  $("moodDelete").classList.toggle("hidden",!record);
  $("moodHint").textContent=record?moodEncouragement[record.mood]:"每種心情都可以被記錄。選一個最接近現在的感受吧。";
  $("moodLength").textContent=`${$("moodText").value.length} / 300`;
}
function renderMoods() {
  const today=data.moods.find(r=>r.date===localDate());
  $("moodStatus").textContent=today?`${MoodDiary.getType(today.mood).icon} 今天的心情：${MoodDiary.getType(today.mood).label}`:"今天，想用什麼表情記住自己？";
  $("monthPicker").value=moodMonth;
  $("calendarTitle").textContent=`${moodMonth.slice(0,4)} 年 ${Number(moodMonth.slice(5))} 月`;
  const grid=$("moodCalendar");grid.replaceChildren();
  const map=new Map(data.moods.map(r=>[r.date,r]));
  MoodDiary.calendar(moodMonth).forEach(date=>{
    if(!date){const blank=el("span","calendar-blank");blank.setAttribute("aria-hidden","true");grid.append(blank);return;}
    const record=map.get(date),type=record&&MoodDiary.getType(record.mood);
    const button=el("button","calendar-day"+(date===localDate()?" is-today":"")+(date===$("moodDate").value?" is-selected":""));
    button.type="button";
    if(type)button.style.background=type.color;
    button.setAttribute("aria-label",`${date}，${type?type.label:"尚未記錄"}`);
    button.setAttribute("aria-pressed",String(date===$("moodDate").value));
    if(date===localDate())button.setAttribute("aria-current","date");
    button.append(el("span","day-number",String(Number(date.slice(8)))),el("span","day-mood",type?type.icon:"·"));
    button.addEventListener("click",()=>{loadMoodDate(date);renderMoods();$("moodForm").scrollIntoView({behavior:"smooth",block:"start"});});
    grid.append(button);
  });
  const {total,counts}=MoodDiary.summary(data.moods,moodMonth);
  $("moodMonthCount").textContent=`${total} 天`;
  $("moodTotalCount").textContent=`${data.moods.length} 天`;
  const bars=$("moodDistribution");bars.replaceChildren();
  counts.forEach(type=>{
    const row=el("div","mood-bar-row");
    const label=el("span",null,`${type.icon} ${type.label}`),track=el("span","mood-bar-track"),fill=el("span","mood-bar-fill");
    fill.style.width=`${total?type.count/total*100:0}%`;fill.style.background=type.color;
    track.setAttribute("aria-hidden","true");track.append(fill);
    row.append(label,track,el("span",null,`${type.count} 天`));bars.append(row);
  });
  $("moodSummaryHint").textContent=total?"這些是你留下的日常足跡，每種心情都有自己的位置。":"這個月還沒有紀錄，從月曆選一天開始吧。";
  const list=$("moodEntries");list.replaceChildren();
  const records=data.moods.filter(r=>r.date.startsWith(moodMonth+"-")).sort((a,b)=>b.date.localeCompare(a.date));
  if(!records.length)list.append(el("div","empty","🌱 這個月的心情花園，等待你的第一筆紀錄。"));
  records.forEach(record=>{
    const type=MoodDiary.getType(record.mood),box=el("article","record"),head=el("div","record-head"),actions=el("div","record-actions"),edit=el("button",null,"查看／編輯");
    head.append(el("h4",null,`${type.icon} ${type.label}`),el("time",null,record.date));
    box.append(head,el("p",null,record.text||"這一天，先用一個表情收藏。"));
    edit.type="button";edit.setAttribute("aria-label",`編輯 ${record.date} 的心情`);
    edit.addEventListener("click",()=>{loadMoodDate(record.date);renderMoods();$("moodForm").scrollIntoView({behavior:"smooth",block:"start"});});
    actions.append(edit);box.append(actions);list.append(box);
  });
}

MoodDiary.types.forEach(type=>{
  const button=el("button","mood-choice");button.type="button";button.dataset.mood=type.id;
  button.setAttribute("aria-pressed","false");button.setAttribute("aria-label",type.label);
  button.append(el("span","mood-icon",type.icon),el("span",null,type.label));
  button.style.setProperty("--mood-color",type.color);
  button.addEventListener("click",()=>{chooseMood(type.id);$("moodHint").textContent=moodEncouragement[type.id];});
  $("moodChoices").append(button);
});
$("moodDate").addEventListener("change",()=>{
  const date=$("moodDate").value;
  if(!MoodDiary.validDate(date))return;
  moodMonth=date.slice(0,7);loadMoodDate(date);renderMoods();
});
$("moodText").addEventListener("input",()=>{$("moodLength").textContent=`${$("moodText").value.length} / 300`;});
$("moodForm").addEventListener("submit",event=>{
  event.preventDefault();
  const record={date:$("moodDate").value,mood:$("moodValue").value,text:$("moodText").value.trim()};
  if(!MoodDiary.getType(record.mood)){toast("先選一個最接近你的心情吧 ♡");$("moodChoices").querySelector("button").focus();return;}
  try{MoodDiary.normalize([record]);}catch{toast("請確認日期與文字長度");return;}
  const exists=data.moods.some(r=>r.date===record.date);
  if(!exists&&data.moods.length>=10000)return toast("紀錄已達上限，請先備份並整理");
  data.moods=data.moods.filter(r=>r.date!==record.date);data.moods.push(record);
  save();moodMonth=record.date.slice(0,7);loadMoodDate(record.date);renderMoods();toast(exists?"心情已更新 ♡":"今天的心情，收藏好了 ♡");
});
$("moodDelete").addEventListener("click",()=>{
  const date=$("moodDate").value;
  if(!confirm(`確定刪除 ${date} 的心情紀錄？`))return;
  data.moods=data.moods.filter(r=>r.date!==date);save();loadMoodDate(date);renderMoods();toast("已刪除這天的心情紀錄");
});
$("moodToday").addEventListener("click",()=>{moodMonth=localDate().slice(0,7);loadMoodDate(localDate());renderMoods();});
$("monthPicker").addEventListener("change",()=>{const month=$("monthPicker").value;if(MoodDiary.validDate(month+"-01")){moodMonth=month;renderMoods();}});
function shiftMoodMonth(delta){
  const date=new Date(moodMonth+"-01T12:00:00Z");date.setUTCMonth(date.getUTCMonth()+delta);
  const next=date.toISOString().slice(0,7);if(/^\d{4}-\d{2}$/.test(next)&&MoodDiary.validDate(next+"-01")){moodMonth=next;renderMoods();}
}
$("monthPrev").addEventListener("click",()=>shiftMoodMonth(-1));
$("monthNext").addEventListener("click",()=>shiftMoodMonth(1));
window.addEventListener("pixel-data-change",()=>{loadMoodDate($("moodDate").value||localDate());renderMoods();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)renderMoods();});
loadMoodDate(localDate());renderMoods();
