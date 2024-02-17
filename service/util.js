const generateReferencePayment=(modePaie)=>{
     const ref = Math.floor(1000 + Math.random() * 9000);
     return `ref-${modePaie.code}-${ref}`;
}
exports.generateReferencePayment=generateReferencePayment
