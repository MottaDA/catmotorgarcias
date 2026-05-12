const SUPABASE_URL = 'https://eaffcbrysngjkdlbwctt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JGqWbrcPZ1IPYCvNvA_kgQ_IABTGbe0';

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login(){

  const email =
    document.getElementById('email').value;

  const password =
    document.getElementById('password').value;

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email,
      password

    });

  if(error){

    mostrarToast(
      traducirError(error.message),
      'error'
    );

    return;
  }

  // AQUI VA EL BLOQUE DE PERFIL

  const perfilTemporal =
    localStorage.getItem(
      'perfilTemporal'
    );

  if(perfilTemporal){

    const perfil =
      JSON.parse(perfilTemporal);

    const userId =
      data.user.id;

    const { data: perfiles } =
      await supabaseClient
        .from('perfiles')
        .select('*')
        .eq('id', userId);

    if(!perfiles || perfiles.length === 0){

      const { error: insertError } =
        await supabaseClient
          .from('perfiles')
          .insert([{

            id:userId,

            nombre:perfil.nombre,

            telefono:perfil.telefono,

            direccion:perfil.direccion

          }]);

      if(insertError){

        console.log(insertError);

        mostrarToast(
          'Error guardando perfil',
          'error'
        );

        return;
      }
    }

    localStorage.removeItem(
      'perfilTemporal'
    );
  }

  mostrarToast(
    'Inicio de sesión exitoso'
  );

  setTimeout(() => {

    window.location.href =
      'index.html';

  }, 1500);
}

async function register(){

  const nombre =
    document.getElementById('nombre').value;

  const telefono =
    document.getElementById('telefono').value;

  const direccion =
    document.getElementById('direccion').value;

  const email =
    document.getElementById('email').value;

  const password =
    document.getElementById('password').value;

  localStorage.setItem(
    'perfilTemporal',

    JSON.stringify({

      nombre,
      telefono,
      direccion

    })
  );

  const { error } =
    await supabaseClient.auth.signUp({

      email,
      password

    });

  if(error){

    mostrarToast(
      traducirError(error.message),
      'error'
    );

    return;
  }

  mostrarToast(
    'Cuenta creada. Revisa tu correo para verificarla'
  );
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

  const loginLink =
    document.getElementById('login-link');

  const registerLink =
    document.getElementById('register-link');

  const logoutLink =
    document.getElementById('logout-link');

  if(data.session){

    if(loginLink)
      loginLink.innerHTML = '';

    if(registerLink)
      registerLink.innerHTML = '';

    if(logoutLink){

      logoutLink.innerHTML = `
        <a href="#" onclick="logout()">
          Cerrar Sesión
        </a>
      `;
    }

  }else{

    if(loginLink){

      loginLink.innerHTML = `
        <a href="login.html">
          Iniciar Sesión
        </a>
      `;
    }

    if(registerLink){

      registerLink.innerHTML = `
        <a href="register.html">
          Registrarse
        </a>
      `;
    }

    if(logoutLink)
      logoutLink.innerHTML = '';
  }
}

async function logout(){

  await supabaseClient.auth.signOut();

  window.location.href = 'index.html';
}

function mostrarToast(mensaje, tipo = 'success'){

  const toast =
    document.getElementById('toast');

  toast.textContent = mensaje;

  toast.className = `
    show ${tipo}
  `;

  setTimeout(() => {

    toast.className =
      toast.className.replace('show', '');

  }, 3000);
}

async function verificarUsuarioLogueado(){

  const { data } =
    await supabaseClient.auth.getSession();

  if(data.session){

    window.location.href = 'index.html';
  }
}

async function recuperarPassword(){

  const email =
    document.getElementById('email').value;

  if(!email){

    mostrarToast(
      'Ingresa tu correo',
      'error'
    );

    return;
  }

  const { error } =
    await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          'https://catmotorgarcias.vercel.app/reset-password.html'
      }
    );

  if(error){

    mostrarToast(
      error.message,
      'error'
    );

    return;
  }

  mostrarToast(
    'Correo de recuperación enviado'
  );
}


function traducirError(error){

  if(
    error.includes(
      'Invalid login credentials'
    )
  ){

    return 'Correo o contraseña incorrectos';
  }

  if(
    error.includes(
      'Password should be at least'
    )
  ){

    return 'La contraseña debe tener mínimo 6 caracteres';
  }

  if(
    error.includes(
      'User already registered'
    )
  ){

    return 'Este correo ya está registrado';
  }

  return error;
}

async function actualizarPassword(){

  const password =
    document.getElementById(
      'new-password'
    ).value;

  const { error } =
    await supabaseClient.auth.updateUser({

      password: password

    });

  if(error){

    mostrarToast(
      error.message,
      'error'
    );

    return;
  }

  mostrarToast(
    'Contraseña actualizada'
  );

  setTimeout(() => {

    window.location.href =
      'login.html';

  }, 2000);
}