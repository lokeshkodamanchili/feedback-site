const SUPABASE_URL = "https://vtonrpwqinzexcoupvzo.supabase.co";
const SUPABASE_KEY = "sb_publishable_FRhu5B5Rh1QaRt9arGr0hQ_4YkKom6S";
const ADMIN_UID = "caa2a28c-5de8-441f-8032-91598f0fa242";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const loginPanel = document.getElementById("loginPanel");
const dashboard = document.getElementById("dashboard");
const statusEl = document.getElementById("loginStatus");
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function showSession(session) {
  const allowed = session?.user?.id === ADMIN_UID;
  loginPanel.classList.toggle("hidden", allowed);
  dashboard.classList.toggle("hidden", !allowed);
  if (allowed) loadAdminReviews();
  else if (session) { statusEl.textContent = "This account is not authorized to manage replies."; db.auth.signOut(); }
}
document.getElementById("loginForm").addEventListener("submit", async event => {
  event.preventDefault(); statusEl.textContent = "Signing in…";
  const {data,error} = await db.auth.signInWithPassword({email:document.getElementById("email").value.trim(),password:document.getElementById("password").value});
  if (error) { statusEl.textContent = error.message; return; }
  if (data.user.id !== ADMIN_UID) { await db.auth.signOut(); statusEl.textContent = "This account is not authorized."; return; }
  statusEl.textContent = ""; showSession(data.session);
});
document.getElementById("logoutBtn").addEventListener("click", async()=>{await db.auth.signOut();dashboard.classList.add("hidden");loginPanel.classList.remove("hidden");});
async function loadAdminReviews(){
 const list=document.getElementById("reviewList");list.innerHTML="<p>Loading feedback…</p>";
 const [{data:feedbacks,error},{data:replies}] = await Promise.all([
  db.from("feedbacks").select("id,name,rating,text,feedback_period").order("id",{ascending:false}),
  db.from("feedback_replies").select("feedback_id,reply_text")
 ]);
 if(error){list.innerHTML='<p class="status">Could not load reviews: '+esc(error.message)+'</p>';return;}
 const replyMap=new Map((replies||[]).map(r=>[String(r.feedback_id),r.reply_text]));
 if(!feedbacks?.length){list.innerHTML="<p>No reviews found.</p>";return;}
 list.innerHTML="";
 feedbacks.forEach(f=>{
  const card=document.createElement("article");card.className="review";const key=String(f.id);
  card.innerHTML='<div class="review-head"><strong>'+esc(f.name||"Anonymous")+'</strong><span class="stars">'+("★".repeat(Number(f.rating)||0))+'</span></div><p class="review-text">'+esc(f.text)+'</p><div class="existing-wrap">'+(replyMap.has(key)?'<div class="existing"><strong>Current BHAAI reply</strong><p>'+esc(replyMap.get(key))+'</p></div>':"")+'</div><label class="field">Your reply<textarea maxlength="2000" placeholder="Write a thoughtful reply…">'+esc(replyMap.get(key)||"")+'</textarea></label><div class="row"><span class="status"></span><button type="button">Publish reply</button></div>';
  const input=card.querySelector("textarea"),button=card.querySelector("button"),status=card.querySelector(".status"),existing=card.querySelector(".existing-wrap");
  button.addEventListener("click",async()=>{
   const reply_text=input.value.trim();if(!reply_text){status.textContent="Please write a reply first.";return;}
   button.disabled=true;status.textContent="Saving…";
   const {error:saveError}=await db.from("feedback_replies").upsert({feedback_id:key,reply_text,admin_user_id:ADMIN_UID,updated_at:new Date().toISOString()},{onConflict:"feedback_id"});
   button.disabled=false;
   if(saveError){status.textContent="Could not save: "+saveError.message;return;}
   status.textContent="Reply published successfully.";existing.innerHTML='<div class="existing"><strong>Current BHAAI reply</strong><p>'+esc(reply_text)+'</p></div>';
  });
  list.appendChild(card);
 });
}
db.auth.getSession().then(({data})=>showSession(data.session));
db.auth.onAuthStateChange((_event,session)=>{if(!session)showSession(null);});
