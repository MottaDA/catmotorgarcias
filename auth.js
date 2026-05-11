const SUPABASE_URL = 'https://eaffcbrysngjkdlbwctt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JGqWbrcPZ1IPYCvNvA_kgQ_IABTGbe0';

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login(){

  const email = document.getElementById('email').value;

  const password = document.getElementById('password').value;

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email,
      password

    });

  if(error){

    alert(error.message);

    return;
  }

  alert('Login exitoso');

  window.location.href = 'index.html';
}

async function register(){

  const email = document.getElementById('email').value;

  const password = document.getElementById('password').value;

  const { data, error } =
    await supabaseClient.auth.signUp({

      email,
      password

    });

  if(error){

    alert(error.message);

    return;
  }

  alert('Revisa tu correo');
}

async function verificarSesion(){

  const { data } =
    await supabaseClient.auth.getSession();

  if(!data.session){

    window.location.href = 'login.html';
  }
}

async function logout(){

  await supabaseClient.auth.signOut();

  window.location.href = 'login.html';
}

async function actualizarBotonAuth(){

  const { data } =
    await supabaseClient.auth.getSession();

  const authLink =
    document.getElementById('auth-link');

  if(!authLink) return;

  if(data.session){

    authLink.innerHTML = `
      <a href="#" onclick="logout()">
        Cerrar Sesión
      </a>
    `;

  }else{

    authLink.innerHTML = `
      <a href="login.html">
        Iniciar Sesión
      </a>
    `;
  }
}

async function logout(){

  await supabaseClient.auth.signOut();

  window.location.href = 'index.html';
}