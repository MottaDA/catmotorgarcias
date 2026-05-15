// ========================================
// CONFIGURACIÓN SUPABASE
// ========================================

const SUPABASE_URL =
  'https://eaffcbrysngjkdlbwctt.supabase.co';

const SUPABASE_ANON_KEY =
  'sb_publishable_JGqWbrcPZ1IPYCvNvA_kgQ_IABTGbe0';

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


// ========================================
// LOGIN
// ========================================

async function login() {

  const email =
    document.getElementById('email').value;

  const password =
    document.getElementById('password').value;

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email,
      password

    });

  // Validación de errores
  if (error) {

    mostrarToast(
      traducirError(error.message),
      'error'
    );

    return;
  }

  // Obtener datos guardados temporalmente
  const datosRegistro =
    localStorage.getItem('datosRegistro');

  if (datosRegistro) {

    const datos =
      JSON.parse(datosRegistro);

    const userId =
      data.user.id;

    // Verificar si el perfil ya existe
    const { data: perfilExistente } =
      await supabaseClient
        .from('perfiles')
        .select('*')
        .eq('id', userId);

    // Crear perfil si no existe
    if (
      !perfilExistente ||
      perfilExistente.length === 0
    ) {

      const { error: perfilError } =
        await supabaseClient
          .from('perfiles')
          .insert([{

            id: userId,

            nombre: datos.nombre,

            telefono: datos.telefono,

            direccion: datos.direccion

          }]);

      console.log(
        'Intentando guardar perfil'
      );

      console.log(datos);
      console.log(userId);
      console.log(perfilError);

      if (perfilError) {

        console.log(perfilError);

      }
    }

    // Eliminar datos temporales
    localStorage.removeItem(
      'datosRegistro'
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


// ========================================
// REGISTRO
// ========================================

async function register() {

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

  const { data, error } =
    await supabaseClient.auth.signUp({

      email,
      password

    });

  // Manejo de errores
  if (error) {

    if (
      error.message.includes(
        'User already registered'
      )
    ) {

      mostrarToast(
        'Este correo ya está registrado',
        'error'
      );

      return;
    }

    mostrarToast(
      traducirError(error.message),
      'error'
    );

    return;
  }

  // Guardar datos temporalmente
  localStorage.setItem(

    'datosRegistro',

    JSON.stringify({

      nombre,
      telefono,
      direccion

    })
  );

  mostrarToast(
    'Cuenta creada. Revisa tu correo para verificarla'
  );
}


// ========================================
// VERIFICAR SESIÓN
// ========================================

async function verificarSesion() {

  const { data } =
    await supabaseClient.auth.getSession();

  if (!data.session) {

    window.location.href =
      'login.html';

  }
}


// ========================================
// ACTUALIZAR BOTONES AUTH
// ========================================

async function actualizarBotonAuth() {

  const { data } =
    await supabaseClient.auth.getSession();

  const loginLink =
    document.getElementById('login-link');

  const registerLink =
    document.getElementById('register-link');

  const logoutLink =
    document.getElementById('logout-link');

  // Usuario logueado
  if (data.session) {

    if (loginLink)
      loginLink.innerHTML = '';

    if (registerLink)
      registerLink.innerHTML = '';

    if (logoutLink) {

      logoutLink.innerHTML = `

        <a href="#" onclick="logout()">
          Cerrar Sesión
        </a>

      `;
    }

  } else {

    // Usuario no logueado
    if (loginLink) {

      loginLink.innerHTML = `

        <a href="login.html">
          Iniciar Sesión
        </a>

      `;
    }

    if (registerLink) {

      registerLink.innerHTML = `

        <a href="register.html">
          Registrarse
        </a>

      `;
    }

    if (logoutLink)
      logoutLink.innerHTML = '';
  }
}


// ========================================
// CERRAR SESIÓN
// ========================================

async function logout() {

  await supabaseClient.auth.signOut();

  window.location.href =
    'index.html';
}


// ========================================
// TOAST MENSAJES
// ========================================

function mostrarToast(
  mensaje,
  tipo = 'success'
) {

  const toast =
    document.getElementById('toast');

  toast.textContent =
    mensaje;

  toast.className =
    `show ${tipo}`;

  setTimeout(() => {

    toast.className =
      toast.className.replace(
        'show',
        ''
      );

  }, 3000);
}


// ========================================
// VERIFICAR USUARIO LOGUEADO
// ========================================

async function verificarUsuarioLogueado() {

  const { data } =
    await supabaseClient.auth.getSession();

  if (data.session) {

    window.location.href =
      'index.html';

  }
}


// ========================================
// RECUPERAR CONTRASEÑA
// ========================================

async function recuperarPassword() {

  const email =
    document.getElementById('email').value;

  if (!email) {

    mostrarToast(
      'Ingresa tu correo',
      'error'
    );

    return;
  }

  const { error } =
    await supabaseClient.auth
      .resetPasswordForEmail(
        email,
        {
          redirectTo:
            'https://catmotorsgarcia.lat/reset-password.html'
        }
      );

  if (error) {

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


// ========================================
// TRADUCIR ERRORES
// ========================================

function traducirError(error) {

  if (
    error.includes(
      'Invalid login credentials'
    )
  ) {

    return 'Correo o contraseña incorrectos';
  }

  if (
    error.includes(
      'Password should be at least'
    )
  ) {

    return 'La contraseña debe tener mínimo 6 caracteres';
  }

  if (
    error.includes(
      'User already registered'
    )
  ) {

    return 'Este correo ya está registrado';
  }

  return error;
}


// ========================================
// ACTUALIZAR CONTRASEÑA
// ========================================

async function actualizarPassword() {

  const password =
    document.getElementById(
      'new-password'
    ).value;

  const { error } =
    await supabaseClient.auth.updateUser({

      password: password

    });

  if (error) {

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


// ========================================
// VERIFICAR ACCESO PEDIDOS
// ========================================

async function verificarAccesoPedido() {

  const { data } =
    await supabaseClient.auth.getSession();

  const pedidoContainer =
    document.getElementById(
      'pedido-container'
    );

  const loginRequired =
    document.getElementById(
      'login-required'
    );

  if (
    !pedidoContainer ||
    !loginRequired
  ) return;

  // Usuario autenticado
  if (data.session) {

    pedidoContainer.style.display =
      'block';

    loginRequired.innerHTML = '';

  } else {

    // Usuario no autenticado
    pedidoContainer.style.display =
      'none';

    loginRequired.innerHTML = `

      <div class="login-warning">

        <p>
          Debes iniciar sesión para hacer un pedido
        </p>

        <a href="login.html">
          Iniciar sesión
        </a>

        <a href="register.html">
          Registrarse
        </a>

      </div>

    `;
  }
}