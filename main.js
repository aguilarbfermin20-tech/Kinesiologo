(() => {
  document.body.classList.remove("no-js");
  const ZONAS = [
    {id:"cuello",nombre:"Cuello",titulo:"Cervicalgia y <em>contracturas</em>",texto:"Muy común en quienes trabajan muchas horas frente a la compu. Liberamos la tensión con terapia manual y te enseñamos ejercicios de movilidad para hacer en el escritorio.",sintomas:["Dolor al girar la cabeza","Dolor de cabeza tensional","Hormigueo en brazos"],sesiones:6,motivo:"Me duele el cuello y tengo contracturas",x:50,y:18.5},
    {id:"hombro",nombre:"Hombro",titulo:"Tendinitis y <em>manguito rotador</em>",texto:"Dolor al levantar el brazo o al dormir de costado. Trabajamos la movilidad y el fortalecimiento progresivo para que vuelvas a entrenar o a trabajar sin dolor.",sintomas:["Dolor al levantar el brazo","Posquirúrgico","Hombro congelado"],sesiones:8,motivo:"Me duele el hombro al levantar el brazo",x:27,y:23},
    {id:"lumbar",nombre:"Zona lumbar",titulo:"Lumbalgia, ciática y <em>hernia de disco</em>",texto:"La consulta más frecuente. Evaluamos tu postura y tu forma de moverte, aliviamos el dolor con terapia manual y armamos una rutina para que no vuelva.",sintomas:["Dolor al agacharte","Dolor que baja por la pierna","Rigidez a la mañana"],sesiones:8,motivo:"Me duele la zona lumbar",x:50,y:44,inicial:true},
    {id:"rodilla",nombre:"Rodilla",titulo:"Meniscos, ligamentos y <em>posquirúrgico</em>",texto:"Desde una molestia al subir escaleras hasta la rehabilitación después de una cirugía de ligamentos. Coordinamos con tu traumatólogo.",sintomas:["Dolor al subir escaleras","Ligamento cruzado","Corredores"],sesiones:12,motivo:"Me duele la rodilla",x:40,y:76},
    {id:"tobillo",nombre:"Tobillo",titulo:"Esguinces y <em>tendón de Aquiles</em>",texto:"Un esguince mal curado vuelve a pasar. Trabajamos la estabilidad y el equilibrio para que vuelvas a correr o a jugar con confianza.",sintomas:["Esguince","Inestabilidad","Fascitis plantar"],sesiones:5,motivo:"Me doblé el tobillo",x:60,y:92}
  ];
  const TRAT = [
    {n:"01",titulo:"Lumbar y cervical",texto:"Contracturas, hernias de disco, ciática y dolor por trabajar sentado muchas horas. Terapia manual, ejercicio y postura.",sesiones:"6 a 10 sesiones",foto:"lumbar.jpg",alt:"Masaje terapéutico en la espalda"},
    {n:"02",titulo:"Lesiones deportivas",texto:"Esguinces, desgarros, tendinitis y vuelta al entrenamiento con cargas controladas.",sesiones:"4 a 12 sesiones",foto:"deporte.jpg",alt:"Grupo de personas corriendo en la calle"},
    {n:"03",titulo:"Rehabilitación posquirúrgica",texto:"Rodilla, hombro y columna, coordinado con tu traumatólogo desde el primer día.",sesiones:"Según indicación médica",foto:"manos.jpg",alt:"Manos del kinesiólogo acompañando a un paciente"},
    {n:"04",titulo:"Postura y prevención",texto:"Evaluación postural y una rutina de fortalecimiento para que el dolor no vuelva.",sesiones:"3 a 5 sesiones",foto:"postura.jpg",alt:"Mujer haciendo ejercicios en una colchoneta"}
  ];
  const COB = {mensajeGenerico:"Traé la orden médica con diagnóstico y cantidad de sesiones, y la credencial. Nosotros gestionamos la autorización.",opciones:["OSDE","Swiss Medical","Galeno","Medifé","Omint","Sancor Salud","OSECAC","Particular"],particular:"La sesión cuesta $ 28.000 y te damos factura para pedir el reintegro."};
  const TURNOS = ["8:00","9:00","10:00","11:00","15:00","16:00","17:00","18:30"];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);

  /* ---------- palabra que rota ---------- */
  const words = [...document.querySelectorAll("#rot > span")];
  let wi = 0;
  if (!reduce) setInterval(() => {
    if (document.hidden) return;
    words[wi].classList.remove("is-on"); words[wi].setAttribute("aria-hidden", "true");
    wi = (wi + 1) % words.length;
    words[wi].classList.add("is-on"); words[wi].removeAttribute("aria-hidden");
  }, 2400);

  /* ---------- capas con el puntero ---------- */
  const orbit = $("#orbit");
  if (!reduce && matchMedia("(hover: hover)").matches) {
    orbit.addEventListener("pointermove", e => {
      const r = orbit.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      orbit.querySelectorAll(".float").forEach(f => { const d = +f.dataset.depth; f.style.transform = `translate(${dx * d}px, ${dy * d}px)`; });
    });
    orbit.addEventListener("pointerleave", () => orbit.querySelectorAll(".float").forEach(f => f.style.transform = ""));
  }

  /* ---------- contadores ---------- */
  if (!reduce) {
    const fmt = n => n.toLocaleString("es-AR");
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const end = +e.target.dataset.count, t0 = performance.now();
      const tick = t => { const k = Math.min(1, (t - t0) / 1200); e.target.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), {threshold: .6});
    document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));
  }

  /* ---------- revelados ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }), {threshold: .05});
  document.querySelectorAll(".reveal").forEach(el => rio.observe(el));

  /* ---------- mapa del cuerpo ---------- */
  const wrap = $("#body-wrap");
  let zonaActual = ZONAS.find(z => z.inicial);
  ZONAS.forEach(z => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "zona"; b.dataset.id = z.id;
    b.style.setProperty("--x", z.x + "%"); b.style.setProperty("--y", z.y + "%");
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span class="ring" aria-hidden="true"></span><span class="tip">${z.nombre}</span>`;
    b.setAttribute("aria-label", z.nombre);
    b.addEventListener("click", () => selectZona(z, true));
    wrap.appendChild(b);
  });
  wrap.addEventListener("keydown", e => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const i = ZONAS.indexOf(zonaActual), d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
    const z = ZONAS[(i + d + ZONAS.length) % ZONAS.length];
    selectZona(z, true); wrap.querySelector(`[data-id="${z.id}"]`).focus();
  });
  function selectZona(z, anim) {
    zonaActual = z;
    wrap.querySelectorAll(".zona").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === z.id));
    const body = $("#panel-body");
    const paint = () => {
      $("#z-kicker").textContent = z.nombre;
      $("#z-title").innerHTML = z.titulo;
      $("#z-txt").textContent = z.texto;
      $("#z-chips").innerHTML = z.sintomas.map(s => `<li>${s}</li>`).join("");
      $("#g-n").textContent = "≈ " + z.sesiones;
      $("#g-fill").style.strokeDashoffset = 100 - (z.sesiones / 12) * 100;
      body.classList.remove("swap");
    };
    if (anim && !reduce) { body.classList.add("swap"); setTimeout(paint, 180); } else paint();
  }
  selectZona(zonaActual, false);
  $("#z-cta").addEventListener("click", () => {
    $("#f-motivo").value = zonaActual.motivo;
  });

  /* ---------- tratamientos ---------- */
  const acc = $("#acc");
  TRAT.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "reveal" + (i === 0 ? " is-open" : "");
    li.innerHTML = `<h3 style="margin:0"><button type="button" class="acc-btn" aria-expanded="${i === 0}" aria-controls="acc-${i}" id="accb-${i}">
        <span class="n">${t.n}</span><span class="t">${t.titulo}</span>
        <span class="ic" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></button></h3>
      <div class="acc-panel" id="acc-${i}" role="region" aria-labelledby="accb-${i}"><div class="acc-in"><div class="acc-content">
        <div><p>${t.texto}</p><span class="pill"><span class="label">suele llevar</span>${t.sesiones}</span></div>
        <div class="ph"><img src="img/${t.foto}" alt="${t.alt}" width="800" height="600" loading="lazy"></div>
      </div></div></div>`;
    acc.appendChild(li);
    rio.observe(li);
  });
  acc.addEventListener("click", e => {
    const b = e.target.closest(".acc-btn"); if (!b) return;
    const li = b.closest("li"), open = b.getAttribute("aria-expanded") === "true";
    acc.querySelectorAll("li").forEach(x => { x.classList.remove("is-open"); x.querySelector(".acc-btn").setAttribute("aria-expanded", "false"); });
    if (!open) { li.classList.add("is-open"); b.setAttribute("aria-expanded", "true"); }
  });

  /* ---------- coberturas ---------- */
  const cob = $("#cob"), sel = $("#f-cob");
  sel.innerHTML = COB.opciones.map(o => `<option${o === "Particular" ? " selected" : ""}>${o}</option>`).join("");
  cob.innerHTML = COB.opciones.map(o => `<li><button type="button" aria-pressed="false">${o}</button></li>`).join("");
  cob.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    cob.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    const o = b.textContent;
    $("#cob-msg").innerHTML = `<strong>${o}.</strong> ${o === "Particular" ? COB.particular : COB.mensajeGenerico} <a href="#turnos">Ya la dejamos elegida en el turnero →</a>`;
    sel.value = o;
  });

  /* ---------- turnero ---------- */
  const tz = "America/Argentina/Buenos_Aires";
  const dias = [];
  const base = new Date();
  for (let i = 1; dias.length < 6 && i < 14; i++) {
    const d = new Date(base.getTime() + i * 864e5);
    const wd = new Intl.DateTimeFormat("es-AR", {timeZone: tz, weekday: "short"}).format(d).replace(".", "");
    const wdl = new Intl.DateTimeFormat("es-AR", {timeZone: tz, weekday: "long"}).format(d);
    if (/sáb|dom/.test(wd)) continue;
    const num = +new Intl.DateTimeFormat("es-AR", {timeZone: tz, day: "numeric"}).format(d);
    const mes = new Intl.DateTimeFormat("es-AR", {timeZone: tz, month: "long"}).format(d);
    dias.push({wd, wdl, num, mes, i: dias.length});
  }
  const ocupado = (di, si) => (di * 3 + si * 2 + dias[di].num) % 3 !== 0 || (di === 0 && si < 2);
  const meses = [...new Set(dias.map(d => d.mes))];
  $("#mes").textContent = meses.join(" · ");
  // próximo turno libre del hero
  outer: for (const d of dias) for (let s = 0; s < TURNOS.length; s++) if (!ocupado(d.i, s)) {
    $("#prox-turno").textContent = `${d.wdl.charAt(0).toUpperCase() + d.wdl.slice(1)} ${d.num} · ${TURNOS[s]}`; break outer;
  }
  const libresSemana = dias.slice(0, 5).reduce((a, d) => a + TURNOS.filter((_, s) => !ocupado(d.i, s)).length, 0);
  document.querySelector(".f-turno .libre").textContent = `${libresSemana} libres esta semana`;

  const daysEl = $("#days"), slotsEl = $("#slots");
  const state = {dia: null, hora: null};
  daysEl.innerHTML = dias.map(d => `<button type="button" class="day" aria-pressed="false" data-i="${d.i}" aria-label="${d.wdl} ${d.num}"><small>${d.wd}</small><b>${d.num}</b></button>`).join("");
  function renderSlots() {
    slotsEl.innerHTML = TURNOS.map((t, s) => {
      const occ = state.dia !== null && ocupado(state.dia, s);
      const dis = state.dia === null || occ;
      return `<button type="button" class="slot" data-s="${s}" aria-pressed="${state.hora === s}" ${dis ? "disabled" : ""} aria-label="${t}${occ ? ", ocupado" : ""}">${t}</button>`;
    }).join("");
  }
  function renderState() {
    daysEl.querySelectorAll(".day").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === state.dia));
    const st = [...document.querySelectorAll("#steps li")];
    st.forEach(li => li.className = "");
    if (state.dia === null) st[0].className = "cur";
    else if (state.hora === null) { st[0].className = "done"; st[1].className = "cur"; }
    else { st[0].className = "done"; st[1].className = "done"; st[2].className = "cur"; }
    const r = $("#resumen");
    if (state.dia !== null && state.hora !== null) {
      const d = dias[state.dia];
      r.textContent = `${d.wdl.charAt(0).toUpperCase() + d.wdl.slice(1)} ${d.num} de ${d.mes} · ${TURNOS[state.hora]} hs`; r.classList.remove("vacio");
    } else { r.textContent = state.dia === null ? "Elegí un día y un horario." : "Ahora elegí un horario."; r.classList.add("vacio"); }
  }
  daysEl.addEventListener("click", e => {
    const b = e.target.closest(".day"); if (!b) return;
    state.dia = +b.dataset.i; state.hora = null; renderSlots(); renderState();
  });
  slotsEl.addEventListener("click", e => {
    const b = e.target.closest(".slot"); if (!b || b.disabled) return;
    state.hora = +b.dataset.s; renderSlots(); renderState();
    slotsEl.querySelector(`[data-s="${state.hora}"]`).focus();
    $("#e-turno").hidden = true;
  });
  renderSlots(); renderState();

  const form = $("#form");
  function setErr(input, el, msg) {
    el.textContent = msg || ""; el.hidden = !msg;
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = $("#f-nombre"), wa = $("#f-wa");
    let ok = true, first = null;
    if (nombre.value.trim().split(/\s+/).length < 2) { setErr(nombre, $("#e-nombre"), "Escribí tu nombre y apellido."); ok = false; first = first || nombre; } else setErr(nombre, $("#e-nombre"));
    const dig = wa.value.replace(/\D/g, "");
    if (dig.length < 10 || dig.length > 13) { setErr(wa, $("#e-wa"), "Revisá el número: con código de área, por ejemplo 11 2345-6789."); ok = false; first = first || wa; } else setErr(wa, $("#e-wa"));
    if (state.dia === null || state.hora === null) { setErr(null, $("#e-turno"), "Te falta elegir día y horario."); ok = false; first = first || daysEl.querySelector(".day"); } else setErr(null, $("#e-turno"));
    if (!ok) { first.focus(); return; }
    const btn = form.querySelector("[type=submit]");
    btn.disabled = true; btn.textContent = "Reservando…";
    setTimeout(() => {
      const d = dias[state.dia];
      document.querySelectorAll("#steps li").forEach(li => li.className = "done");
      $("#form-col").innerHTML = `<div class="ok-card" role="status" tabindex="-1"><span class="label" style="color:#bdb5ff">turno pedido</span>
        <h4>Listo, ${nombre.value.trim().split(/\s+/)[0]}.</h4>
        <p>${d.wdl.charAt(0).toUpperCase() + d.wdl.slice(1)} ${d.num} de ${d.mes}, ${TURNOS[state.hora]} hs, con el Lic. Tomás Rivero. Te confirmamos por WhatsApp dentro de las 2 horas hábiles.</p>
        <p style="font-size:14px">Es una demo: el pedido no se envió a ningún lado.</p>
        <button type="button" class="btn" id="otro">Pedir otro turno</button></div>`;
      const card = $("#form-col .ok-card"); card.focus();
      $("#otro").addEventListener("click", () => location.reload());
    }, reduce ? 0 : 700);
  });
})();
