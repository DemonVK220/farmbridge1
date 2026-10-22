      {certPreview && (() => {
        const farmer = farmers.find((f) => f.id === certPreview.farmerId);
        const cert = farmer?.certificates?.find((c) => c.id === certPreview.certId);
        if (!farmer || !cert) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" onClick={() => setCertPreview(null)}>
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold font-serif text-stone-900">{cert.type}</h3>
              <p className="text-xs text-stone-500">{farmer.name} • Cert #{cert.certificateNumber}</p>
              <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-stone-500">Issuing Authority:</span><strong className="text-stone-900 text-right max-w-[60%]">{cert.issuingAuthority}</strong></div>
                <div className="flex justify-between"><span className="text-stone-500">Issue Date:</span><strong className="text-stone-900">{cert.issueDate}</strong></div>
                <div className="flex justify-between"><span className="text-stone-500">Expiry:</span><strong className="text-stone-900">{cert.expiryDate}</strong></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { addToast('warning', `Suspension notice sent to ${farmer.name}.`); setCertPreview(null); }} className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs cursor-pointer">Request Clarification</button>
                <button onClick={() => { addToast('success', `Certificate verified.`); setCertPreview(null); }} className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer">Confirm Verification</button>
              </div>
            </div>
          </div>
        );
      })()}