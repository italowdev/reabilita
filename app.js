const workouts = [
 {id:1,name:"Academia A",subtitle:"Fortalecimento de quadríceps",symbol:"▥",exercises:[
  ["Cadeira extensora","2 séries de 10–12 repetições. Carga leve, sem provocar dor."],
  ["Leg press 45°","3 × 10–12. Desça somente até onde conseguir sem desconforto."],
  ["Sentar e levantar do banco","2 × 10."],
  ["Step-up baixo","2 × 8 por perna."],
  ["Panturrilha em pé","3 × 15."],
  ["Cadeira abdutora","3 × 12–15."]
 ]},
 {id:2,name:"Academia B",subtitle:"Posterior e estabilidade",symbol:"▤",exercises:[
  ["Cadeira flexora","3 × 12."],
  ["Elevação pélvica","3 × 12."],
  ["Stiff com halteres","2 × 10, com carga leve."],
  ["Cadeira abdutora","3 × 15."],
  ["Panturrilha unilateral","2 × 12 por perna."],
  ["Equilíbrio unilateral","3 × 30 segundos por perna."]
 ]},
 {id:3,name:"Casa e grama",subtitle:"Controle, coordenação e preparação",symbol:"⌁",exercises:[
  ["Isometria de quadríceps","3 × 12 repetições, segurando 5 segundos."],
  ["Elevação de perna estendida","2 × 12 por perna."],
  ["Ponte de glúteos","3 × 12."],
  ["Equilíbrio em uma perna","3 × 20–30 segundos por perna."],
  ["Marcha com elevação dos joelhos","2 × 20 segundos."],
  ["Transferência lateral de peso","2 × 10 para cada lado."],
  ["Caminhada entre cones","3 percursos curtos, sem correr."]
 ]}
];
const schedule=[["Segunda","Treino 1 — Academia A",1],["Terça","Descanso das pernas",0],["Quarta","Treino 2 — Academia B",2],["Quinta","Descanso das pernas",0],["Sexta","Treino 3 — Casa/grama",3],["Sábado","Recuperação",0],["Domingo","Recuperação",0]];
const $=s=>document.querySelector(s);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
let completions=read("rehab_completions",[]);
let checkins=read("rehab_checkins",[]);
let selectedWorkout=1;
let checkedExercises={};
const today=new Date();
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmt=d=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(d);
const todayIndex=(today.getDay()+6)%7;
const todayWorkoutId=({0:1,2:2,4:3})[todayIndex]||0;
function save(){localStorage.setItem("rehab_completions",JSON.stringify(completions));localStorage.setItem("rehab_checkins",JSON.stringify(checkins))}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function isDone(id,day=dateKey(today)){return completions.some(x=>x.id===id&&x.date===day)}
function renderWeek(){
 const labels=["SEG","TER","QUA","QUI","SEX","SÁB","DOM"];
 $("#weekDays").innerHTML=labels.map((l,i)=>{const id=({0:1,2:2,4:3})[i];const d=new Date(today);d.setDate(today.getDate()-todayIndex+i);return `<div class="day-dot ${i===todayIndex?"today":""} ${id&&isDone(id,dateKey(d))?"done":""}">${l}<b>${d.getDate()}</b></div>`}).join("");
 const done=[1,2,3].filter(id=>isDone(id)).length;$("#weekCount").textContent=`${done} de 3 treinos concluídos`;$("#weekPercent").textContent=`${Math.round(done/3*100)}%`;$("#weekBar").style.width=`${done/3*100}%`;
}
function renderHome(){
 $("#todayDate").textContent=new Intl.DateTimeFormat("pt-BR",{weekday:"short",day:"2-digit",month:"short"}).format(today);
 const w=workouts.find(x=>x.id===todayWorkoutId);
 $("#todayTitle").textContent=w?"Treino recomendado para hoje":"Dia de recuperação";
 $("#todayWorkout").innerHTML=w?`<div class="workout-card"><div class="workout-symbol">${w.symbol}</div><div class="workout-info"><strong>Treino ${w.id} — ${w.name}</strong><span>${w.subtitle} · ${w.exercises.length} exercícios</span></div><button class="arrow-btn" data-open="${w.id}" aria-label="Abrir treino">→</button></div>`:`<div class="workout-card"><div class="workout-symbol">♡</div><div class="workout-info"><strong>Recuperação programada</strong><span>Dia sem treino de pernas. Respeite seu descanso.</span></div></div>`;
 document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{selectedWorkout=+b.dataset.open;showPage("workoutsPage");renderWorkout()});
}
function renderTabs(){$("#workoutTabs").innerHTML=workouts.map(w=>`<button class="workout-tab ${w.id===selectedWorkout?"active":""}" data-tab="${w.id}">Treino ${w.id}</button>`).join("");document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{selectedWorkout=+b.dataset.tab;checkedExercises={};renderWorkout()})}
function renderWorkout(){
 renderTabs();const w=workouts.find(x=>x.id===selectedWorkout);
 $("#workoutDetail").innerHTML=`<div class="detail-hero"><p class="eyebrow">TREINO ${w.id}</p><h2>${w.name}</h2><p>${w.subtitle}</p></div><div class="exercise-list">${w.exercises.map((e,i)=>`<label class="exercise ${checkedExercises[i]?"done":""}"><input class="exercise-check" type="checkbox" data-ex="${i}" ${checkedExercises[i]?"checked":""}><span class="exercise-copy"><strong>${i+1}. ${e[0]}</strong><span>${e[1]}</span></span><span class="exercise-count">${i+1}/${w.exercises.length}</span></label>`).join("")}</div><div class="complete-card"><p id="exerciseProgress">${Object.values(checkedExercises).filter(Boolean).length} de ${w.exercises.length} exercícios marcados</p><button class="btn btn-primary full" id="finishWorkout">Concluir treino</button><p style="margin:10px 0 0">Marque os exercícios realizados. Só conclua quando terminar a sessão.</p></div>`;
 document.querySelectorAll("[data-ex]").forEach(c=>c.onchange=()=>{checkedExercises[c.dataset.ex]=c.checked;renderWorkout()});
 $("#finishWorkout").disabled=Object.values(checkedExercises).filter(Boolean).length!==w.exercises.length;
 $("#finishWorkout").onclick=()=>{if(!isDone(w.id)){completions.push({id:w.id,date:dateKey(today),name:w.name});save()}showToast("Treino registrado. Bom trabalho!");renderAll();checkedExercises={};renderWorkout()};
}
function renderSchedule(){$("#scheduleList").innerHTML=schedule.map(([d,a,id])=>`<div class="schedule-row"><span class="schedule-day">${d}</span><span class="schedule-activity">${a}</span><span class="schedule-tag ${id?"":"rest"}">${id?"Treino":"Pausa"}</span></div>`).join("")}
function renderProgress(){
 $("#totalDone").textContent=completions.length;$("#checkinTotal").textContent=checkins.length;
 $("#historyList").innerHTML=completions.length?[...completions].reverse().slice(0,12).map(x=>`<div class="history-item"><strong>Treino ${x.id} — ${x.name}</strong><span>${fmt(new Date(x.date+"T12:00:00"))}</span></div>`).join(""):`<div class="empty">Seus treinos concluídos aparecerão aqui.</div>`;
 $("#checkinHistory").innerHTML=checkins.length?[...checkins].reverse().slice(0,8).map(x=>`<div class="history-item"><strong>Desconforto: ${x.pain}/10 ${x.swelling?"· Inchaço":""}</strong><span>${fmt(new Date(x.date+"T12:00:00"))}${x.note?`<br>${escapeHtml(x.note)}`:""}</span></div>`).join(""):`<div class="empty">Seus registros diários aparecerão aqui.</div>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderAll(){renderWeek();renderHome();renderProgress();renderSchedule()}
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("selected",b.dataset.page===id));if(id==="workoutsPage")renderWorkout();if(id==="progressPage")renderProgress();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$("#painRange").oninput=e=>$("#painValue").textContent=e.target.value+"/10";
$("#saveCheckin").onclick=()=>{checkins.push({date:dateKey(today),pain:+$("#painRange").value,swelling:$("#swellingCheck").checked,note:$("#dailyNote").value.trim()});save();$("#dailyNote").value="";$("#swellingCheck").checked=false;$("#painRange").value=0;$("#painValue").textContent="0/10";renderProgress();showToast("Registro salvo com sucesso")};
$("#clearData").onclick=()=>{if(confirm("Apagar todos os treinos concluídos e registros de bem-estar deste aparelho?")){completions=[];checkins=[];save();renderAll();showToast("Registros apagados")}};
$("#profileBtn").onclick=()=>showToast("Seus dados ficam salvos neste aparelho.");
renderAll();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
