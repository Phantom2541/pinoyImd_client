import Swal from "sweetalert2";

const validate = {
  pricing: (isDuplicate, variants) => {
    const { types = [] } = variants || {};
    const options1 = types[0]?.options || [];
    const options2 = types[1]?.options || [];
    const has2Variant = types.length > 1;
    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: `<span style="color:#e74c3c; font-weight:bold;">🚫 Duplicate Detected</span>`,
        html: `
    <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
      You have <b style="color:#e74c3c;">duplicate variation titles</b> or <b style="color:#e74c3c;">options</b>.
      <br/><br/>
      👉 Please resolve this first to ensure <b style="color:#3498db;">accurate pricing, cost, and stock declaration</b>.
    </div>
  `,
        confirmButtonText: "Understood",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    // Check titles
    if (!types[0]?.title?.trim()) {
      Swal.fire({
        icon: "warning",
        title: `<span style="color:#f39c12; font-weight:bold;">⚠ Missing Variant Title</span>`,
        html: `
    <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
      Please add a <b style="color:#e74c3c;">title</b> for the first variation 
      before setting <b style="color:#3498db;">stock, price, and cost</b> to ensure accuracy.
    </div>
  `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
      });

      return false;
    }

    if (has2Variant && !types[1]?.title?.trim()) {
      Swal.fire({
        icon: "warning",
        title: `<span style="color:#f39c12; font-weight:bold;">⚠ Missing Variant Title</span>`,
        html: `
    <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
      Please add a <b style="color:#e74c3c;">title</b> for the <b style="color:#3498db;">second variation</b> 
      before setting <b style="color:#3498db;">stock, price, and cost</b> to ensure accuracy.
    </div>
  `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
      });

      return false;
    }

    // Check options
    const emptyOption1 = options1.some((opt) => !opt?.trim());
    if (emptyOption1) {
      Swal.fire({
        icon: "warning",
        title: `<span style="color:#f39c12; font-weight:bold;">⚠ Missing Option Value</span>`,
        html: `
    <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
      Some <b style="color:#e74c3c;">options</b> in the <b style="color:#3498db;">first variant</b> are empty. 
      Please provide values to ensure accurate <b style="color:#3498db;">pricing, cost, and stock</b> declaration.
    </div>
  `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }

    if (has2Variant) {
      const emptyOption2 = options2.some((opt) => !opt?.trim());
      if (emptyOption2) {
        Swal.fire({
          icon: "warning",
          title: `<span style="color:#f39c12; font-weight:bold;">⚠ Missing Option Value</span>`,
          html: `
    <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
      Some <b style="color:#e74c3c;">options</b> in the <b style="color:#3498db;">second variant</b> are empty. 
      Please provide values to ensure accurate <b style="color:#3498db;">pricing, cost, and stock</b> declaration.
    </div>
  `,
          confirmButtonText: "Got it",
          confirmButtonColor: "#3085d6",
        });
        return false;
      }
    }

    return true;
  },
  img: {
    hasOption: (option, variantName = "", index) => {
      if (option) return true;
      Swal.fire({
        icon: "warning",
        title: `<span style="font-size: 20px; font-weight: 600; color:#f39c12">⚠ Missing Option Name in ${
          `${variantName} Variation` || "Variant 1"
        }</span>`,
        html: `
                <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
                  You are trying to <b style="color:#3498db;">upload an image</b> for 
                  <b style="color:#e74c3c;">Option #${index + 1}</b>, 
                  but this option doesn't have a <b>name</b> yet.
                  <br/><br/>
                  👉 Please add a name for this option before uploading an image.
                </div>
              `,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
      });
      return false;
    },
    duplicateVariant: (isDuplicate) => {
      if (!isDuplicate) return false;
      Swal.fire({
        icon: "error",
        title: `<span style="font-size: 20px; font-weight: 600; color:#e74c3c">🚫 Duplicate Detected</span>`,
        html: `
                <div style="font-size:16px; color:#333; text-align:left; line-height:1.5;" class="text-center">
                  You are trying to <b style="color:#3498db;">upload an image</b>, but your 
                  <b>variant name</b> or one of its <b>option names</b> is duplicated.
                  <br/><br/>
                  👉 Please resolve the <span style="color:#e74c3c; font-weight:bold;">duplicate issue</span> 
                  before uploading images to ensure proper organization of your variants.
                </div>
              `,
        confirmButtonText: "Understood",
        confirmButtonColor: "#3085d6",
      });
      return true;
    },
  },
};

export default validate;
