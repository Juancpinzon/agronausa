// PoliticaPrivacidad.tsx
// Usar en: src/pages/PoliticaPrivacidad.tsx
// Ruta: /politica-privacidad
// ─────────────────────────────────────────────
// Para BSM: reemplaza NOMBRE_EMPRESA, NIT, EMAIL_CONTACTO y CIUDAD

const EMPRESA = {
  nombre: "Agronausa",                          // BSM: "Bogotá Seafood Market"
  nit: "PENDIENTE",                             // Reemplazar con NIT real
  email: "privacidad@agronausa.com",            // BSM: privacidad@bsm.com.co
  ciudad: "Bogotá D.C.",
  pais: "Colombia",
  fechaVigencia: "3 de mayo de 2026",
};

export default function PoliticaPrivacidad() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-[--color-text]">
      <h1 className="text-2xl font-semibold mb-2">Política de tratamiento de datos personales</h1>
      <p className="text-sm text-[--color-text-muted] mb-10">
        {EMPRESA.nombre} · Vigente desde {EMPRESA.fechaVigencia}
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">1. Responsable del tratamiento</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          <strong className="text-[--color-text]">{EMPRESA.nombre}</strong>, identificada con NIT{" "}
          {EMPRESA.nit}, con domicilio en {EMPRESA.ciudad}, {EMPRESA.pais}, es la responsable del
          tratamiento de los datos personales recolectados a través de esta plataforma. Para
          cualquier solicitud relacionada con sus datos puede escribir a{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-[--color-primary] underline">
            {EMPRESA.email}
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">2. Datos que recolectamos</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted] mb-3">
          Al registrarse o realizar un pedido en nuestra plataforma, recolectamos:
        </p>
        <ul className="text-sm text-[--color-text-muted] space-y-1 list-disc list-inside">
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono o celular</li>
          <li>Dirección de entrega (departamento, ciudad, dirección)</li>
          <li>Nombre y NIT del negocio, si aplica</li>
        </ul>
        <p className="text-sm leading-relaxed text-[--color-text-muted] mt-3">
          No recolectamos datos sensibles como información financiera completa, datos de salud ni
          información biométrica.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">3. Finalidad del tratamiento</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted] mb-3">
          Sus datos se usan exclusivamente para:
        </p>
        <ul className="text-sm text-[--color-text-muted] space-y-1 list-disc list-inside">
          <li>Procesar y gestionar sus pedidos</li>
          <li>Comunicarle el estado de su pedido</li>
          <li>Coordinar la entrega o recogida del producto</li>
          <li>Atender solicitudes, quejas o devoluciones</li>
          <li>Enviar comunicaciones comerciales, solo si usted lo autoriza expresamente</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">4. Protección de menores de edad</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          El registro y uso de la plataforma está limitado a mayores de 18 años. {EMPRESA.nombre} no
          recolecta intencionalmente datos de menores de edad sin la autorización de sus
          representantes legales. Si usted tiene conocimiento de que un menor de edad ha
          proporcionado datos personales sin la debida autorización, le pedimos que nos contacte de
          inmediato a{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-[--color-primary] underline">
            {EMPRESA.email}
          </a>
          {" "}para proceder a la eliminación de dicha información conforme a lo establecido en el
          artículo 7 de la Ley 1581 de 2012.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">5. Base legal</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          El tratamiento se realiza con base en la Ley 1581 de 2012 y el Decreto 1377 de 2013. Al
          completar el formulario de pedido y marcar la casilla de aceptación, usted otorga su
          consentimiento libre e informado para el tratamiento descrito en esta política.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">6. Compartición de datos</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          {EMPRESA.nombre} no vende ni cede sus datos personales a terceros con fines comerciales.
          Podemos compartir información estrictamente necesaria con proveedores de logística o
          transportistas para completar la entrega de su pedido, quienes están sujetos a
          obligaciones de confidencialidad.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">7. Almacenamiento y seguridad</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          Los datos se almacenan en servidores seguros con cifrado en tránsito (HTTPS) y en reposo.
          Aplicamos controles de acceso para que solo el personal autorizado pueda consultarlos.
          Conservamos su información mientras sea necesaria para la relación comercial y por el
          período que exija la ley para efectos tributarios o de garantía.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">8. Transferencia y transmisión internacional de datos</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          Sus datos pueden ser almacenados o procesados en servidores ubicados fuera de Colombia,
          incluyendo proveedores de infraestructura en la nube que {EMPRESA.nombre} utiliza para
          operar la plataforma (por ejemplo, servicios de alojamiento, bases de datos o herramientas
          de análisis). En tales casos, {EMPRESA.nombre} garantiza que dichos proveedores cuentan con
          niveles de protección equivalentes a los exigidos por la legislación colombiana y que el
          tratamiento se realiza conforme a los estándares del artículo 26 de la Ley 1581 de 2012.
          Al aceptar esta política, usted autoriza dicha transferencia internacional en los términos
          aquí descritos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">9. Sus derechos</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted] mb-3">
          De acuerdo con la ley colombiana, usted puede en cualquier momento:
        </p>
        <ul className="text-sm text-[--color-text-muted] space-y-1 list-disc list-inside">
          <li>Conocer qué datos tenemos sobre usted</li>
          <li>Actualizar o corregir información inexacta</li>
          <li>Solicitar la eliminación de sus datos cuando no exista obligación legal de conservarlos</li>
          <li>Revocar la autorización para comunicaciones comerciales</li>
          <li>Presentar una queja ante la Superintendencia de Industria y Comercio (SIC)</li>
        </ul>
        <p className="text-sm leading-relaxed text-[--color-text-muted] mt-3">
          Para ejercer cualquiera de estos derechos escriba a{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-[--color-primary] underline">
            {EMPRESA.email}
          </a>
          . Responderemos en un plazo máximo de diez días hábiles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">10. Cambios a esta política</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          Si modificamos esta política, publicaremos la nueva versión en esta misma página con la
          fecha de actualización. Para cambios materiales que afecten sus derechos, le notificaremos
          por correo electrónico si tenemos su dirección registrada.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">11. Contacto</h2>
        <p className="text-sm leading-relaxed text-[--color-text-muted]">
          {EMPRESA.nombre} · {EMPRESA.ciudad}, {EMPRESA.pais}
          <br />
          Correo:{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-[--color-primary] underline">
            {EMPRESA.email}
          </a>
        </p>
      </section>

      <div className="border-t border-[--color-border] pt-6 mt-10">
        <p className="text-xs text-[--color-text-muted]">
          Esta política fue elaborada conforme a la Ley 1581 de 2012 (Ley de Protección de Datos
          Personales de Colombia) y el Decreto Reglamentario 1377 de 2013. No constituye asesoría
          jurídica. Si tiene dudas sobre su cumplimiento normativo, consulte a un abogado.
        </p>
      </div>
    </main>
  );
}
