// AutoBook AI frontend interactions
// Safe for browser: no secret keys here. Secrets stay in Netlify Environment Variables and Netlify Functions.

function showAuth(){
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('auth')?.classList.remove('hidden');
}
function showLanding(){
  document.getElementById('auth')?.classList.add('hidden');
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('landing')?.classList.remove('hidden');
}
function login(){
  localStorage.setItem('ab_session',JSON.stringify({firstName:'Natalie',lastName:'Park',businessName:'GlowHaus Med Spa',email:'demo@autobook.ai'}));
  document.getElementById('auth')?.classList.add('hidden');
  document.getElementById('landing')?.classList.add('hidden');
  document.getElementById('app')?.classList.remove('hidden');
}
function logout(){
  localStorage.removeItem('ab_session');
  document.getElementById('app')?.classList.add('hidden');
  document.getElementById('auth')?.classList.add('hidden');
  document.getElementById('landing')?.classList.remove('hidden');
}
function startDemo(){ login(); }
function page(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('p-'+id)?.classList.add('active');
  const title=document.getElementById('pageTitle');
  if(title) title.textContent=id[0].toUpperCase()+id.slice(1);
  document.querySelectorAll('.side-btn,.mobile button').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function getCurrentUserEmail(){
  try{
    const session=JSON.parse(localStorage.getItem('ab_session')||'{}');
    return session.email || document.getElementById('email')?.value || 'demo@autobook.ai';
  }catch(e){ return 'demo@autobook.ai'; }
}

// FRONTEND STRIPE CHECKOUT CALL
// This calls: netlify/functions/create-checkout-session.js
async function startCheckout(plan,billingCycle,button){
  const originalText=button?.innerHTML;
  try{
    if(button){ button.disabled=true; button.innerHTML='<span class="loader"></span> Opening checkout...'; }
    const response=await fetch('/.netlify/functions/create-checkout-session',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        plan,
        billingCycle,
        customerEmail:getCurrentUserEmail()
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'Could not create checkout session.');
    if(!data.url) throw new Error('Checkout URL was not returned by the server.');
    window.location.href=data.url;
  }catch(err){
    console.error(err);
    showToast('Checkout is not connected yet. Add the Netlify Function and Stripe env variables.');
    if(button) button.innerHTML=originalText;
  }finally{
    if(button) button.disabled=false;
  }
}

// FRONTEND AI CALL
// This calls: netlify/functions/ai-generate.js
async function genAI(){
  const out=document.getElementById('aiOut');
  const input=document.getElementById('aiInput');
  if(!out) return;
  const customerMessage=input?.value || 'Hi! How much are highlights and do you have anything this Saturday?';
  out.innerHTML='<span class="loader"></span> Generating AI reply...';
  try{
    const response=await fetch('/.netlify/functions/ai-generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        task:'customer_reply',
        tone:'friendly and professional',
        businessContext:'Luxe Hair Studio offers Cut & Blowout ($75), Full Color ($140), Full Highlights ($180), and Keratin Treatment ($220). Business hours are Monday-Friday 9am-8pm and Saturday 10am-6pm.',
        customerMessage
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'AI request failed.');
    out.textContent=data.text || fallbackReply(customerMessage);
  }catch(err){
    console.warn(err);
    out.textContent=fallbackReply(customerMessage);
    showToast('AI backend is not connected yet. Showing a safe local fallback reply.');
  }
}

function fallbackReply(customerMessage){
  const lower=(customerMessage||'').toLowerCase();
  if(lower.includes('price')||lower.includes('how much')||lower.includes('cost')||lower.includes('highlight')){
    return 'Hi Sophie! Thanks for reaching out. Full Highlights are $180 and take about 2.5 hours. I have Saturday at 10:00 AM or 1:00 PM available — which works best for you?';
  }
  if(lower.includes('reschedule')){
    return 'Of course — no problem at all. I can help reschedule your appointment. I have Tuesday at 2:00 PM, Wednesday at 11:30 AM, or Friday at 9:00 AM available. Which works best?';
  }
  return 'Hi! Thanks so much for reaching out. I’d be happy to help you book an appointment. Could you share your name, phone number, preferred service, and what day or time works best?';
}

function copyAI(){
  const text=document.getElementById('aiOut')?.textContent || '';
  navigator.clipboard?.writeText(text);
  showToast('Reply copied');
}
function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;right:20px;bottom:20px;background:#0f172a;color:white;padding:12px 18px;border-radius:12px;z-index:9999;box-shadow:0 12px 34px rgba(0,0,0,.25);font-weight:800;font-size:13px;max-width:360px;line-height:1.45';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3600);
}

function setDbOutput(value){
  const out=document.getElementById('db-output');
  if(!out) return;
  out.textContent=typeof value==='string'?value:JSON.stringify(value,null,2);
}
function syncBusinessId(){
  const main=document.getElementById('db-business-id')?.value || '';
  ['db-appt-business-id','db-conv-business-id'].forEach(id=>{const el=document.getElementById(id); if(el && !el.value) el.value=main;});
}
async function callFunction(name,payload){
  setDbOutput(`Calling /.netlify/functions/${name}...`);
  const res=await fetch(`/.netlify/functions/${name}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const data=await res.json().catch(()=>({error:'Invalid JSON response'}));
  if(!res.ok) throw new Error(data.error || `Function ${name} failed`);
  return data;
}
async function createCustomerFromForm(){
  try{
    const payload={
      businessId:document.getElementById('db-business-id')?.value.trim(),
      name:document.getElementById('db-customer-name')?.value.trim(),
      email:document.getElementById('db-customer-email')?.value.trim(),
      phone:document.getElementById('db-customer-phone')?.value.trim(),
      notes:document.getElementById('db-customer-notes')?.value.trim()
    };
    if(!payload.businessId||!payload.name) throw new Error('Business ID and customer name are required. Create a business in Supabase first, then paste its UUID here.');
    const data=await callFunction('create-customer',payload);
    setDbOutput(data);
    const customerId=data.customer?.id;
    if(customerId){
      const a=document.getElementById('db-appt-customer-id'); if(a&&!a.value)a.value=customerId;
      const c=document.getElementById('db-conv-customer-id'); if(c&&!c.value)c.value=customerId;
    }
    syncBusinessId();
    showToast('Customer created in Supabase');
  }catch(err){setDbOutput({error:err.message}); showToast('Customer creation failed');}
}
async function createAppointmentFromForm(){
  try{
    const payload={
      businessId:document.getElementById('db-appt-business-id')?.value.trim() || document.getElementById('db-business-id')?.value.trim(),
      customerId:document.getElementById('db-appt-customer-id')?.value.trim(),
      serviceName:document.getElementById('db-appt-service')?.value.trim(),
      startTime:document.getElementById('db-appt-start')?.value,
      endTime:document.getElementById('db-appt-end')?.value,
      price:Number(document.getElementById('db-appt-price')?.value||0),
      source:'website'
    };
    if(!payload.businessId||!payload.serviceName||!payload.startTime) throw new Error('Business ID, service name, and start time are required.');
    const data=await callFunction('create-appointment',payload);
    setDbOutput(data);
    showToast('Appointment created in Supabase');
  }catch(err){setDbOutput({error:err.message}); showToast('Appointment creation failed');}
}
async function createConversationFromForm(){
  try{
    const payload={
      businessId:document.getElementById('db-conv-business-id')?.value.trim() || document.getElementById('db-business-id')?.value.trim(),
      customerId:document.getElementById('db-conv-customer-id')?.value.trim(),
      channel:document.getElementById('db-conv-channel')?.value,
      firstMessage:document.getElementById('db-conv-message')?.value.trim()
    };
    if(!payload.businessId||!payload.channel||!payload.firstMessage) throw new Error('Business ID, channel, and first message are required.');
    const data=await callFunction('create-conversation',payload);
    setDbOutput(data);
    showToast('Conversation created in Supabase');
  }catch(err){setDbOutput({error:err.message}); showToast('Conversation creation failed');}
}

document.addEventListener('click',e=>{
  const actionEl=e.target.closest('[data-action]');
  if(actionEl){
    const action=actionEl.dataset.action;
    if(action==='show-auth') showAuth();
    if(action==='show-landing') showLanding();
    if(action==='login') login();
    if(action==='logout') logout();
    if(action==='start-demo') startDemo();
    if(action==='generate-ai') genAI();
    if(action==='copy-ai') copyAI();
    if(action==='save-settings') showToast('Saved production settings');
    if(action==='create-customer') createCustomerFromForm();
    if(action==='create-appointment') createAppointmentFromForm();
    if(action==='create-conversation') createConversationFromForm();
    if(action==='clear-db-output') setDbOutput('Run a database action to see the response here.');
  }
  const planEl=e.target.closest('[data-plan]');
  if(planEl){
    e.preventDefault();
    startCheckout(planEl.dataset.plan, planEl.dataset.billing || 'monthly', planEl);
  }
  const pageEl=e.target.closest('[data-page]');
  if(pageEl) page(pageEl.dataset.page,pageEl);
  const faq=e.target.closest('.faq-q');
  if(faq) faq.parentElement.classList.toggle('open');
});
