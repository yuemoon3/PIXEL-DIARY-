/* Shared validation and calendar calculations; no browser dependencies. */
const MoodDiary = (() => {
  const types = Object.freeze([
    {id:"happy",label:"開心",icon:"😊",color:"#ffe08b"},
    {id:"calm",label:"平靜",icon:"🌿",color:"#bbebd7"},
    {id:"okay",label:"普通",icon:"🙂",color:"#ffd2e5"},
    {id:"low",label:"低落",icon:"🌧️",color:"#cbd9fa"},
    {id:"tired",label:"疲倦",icon:"🌙",color:"#d9c7f4"}
  ]);
  const getType = id => types.find(t=>t.id===id);
  function validDate(value) {
    if(typeof value!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date=new Date(value+"T12:00:00Z");
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10)===value;
  }
  function normalize(records) {
    if(records===undefined) return []; // v1 backups contain no moods.
    if(!Array.isArray(records)||records.length>10000) throw Error("心情紀錄格式不正確");
    const seen=new Set();
    return records.map(record=>{
      if(!record || !validDate(record.date) || !getType(record.mood) || typeof record.text!=="string" || record.text.length>300 || seen.has(record.date)) throw Error("心情紀錄格式不正確或日期重複");
      seen.add(record.date);
      return {date:record.date,mood:record.mood,text:record.text};
    });
  }
  function calendar(month) {
    if(!/^\d{4}-\d{2}$/.test(month)||!validDate(month+"-01")) throw Error("月份不正確");
    const first=new Date(month+"-01T12:00:00Z");
    const year=first.getUTCFullYear(), index=first.getUTCMonth();
    const last=new Date(first);last.setUTCMonth(index+1,0);
    const offset=(first.getUTCDay()+6)%7;
    return Array.from({length:Math.ceil((offset+last.getUTCDate())/7)*7},(_,i)=>{
      const day=i-offset+1;
      return day>0&&day<=last.getUTCDate()?`${String(year).padStart(4,"0")}-${String(index+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`:null;
    });
  }
  function summary(records,month) {
    const rows=records.filter(r=>r.date.startsWith(month+"-"));
    return {total:rows.length,counts:types.map(t=>({...t,count:rows.filter(r=>r.mood===t.id).length}))};
  }
  return Object.freeze({types,getType,validDate,normalize,calendar,summary});
})();
if(typeof module!=="undefined") module.exports=MoodDiary;
