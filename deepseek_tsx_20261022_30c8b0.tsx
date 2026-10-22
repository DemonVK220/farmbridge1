          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-serif">Certificate & Document Audit</h2>
            <div className="space-y-2 text-xs">
              {farmers.flatMap((f) => (f.certificates || []).map((cert) => ({ farmer: f, cert }))).map(({ farmer, cert }) => (
                <div key={`${farmer.id}-${cert.id}`} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-stone-900 text-sm">{cert.type}</strong>
                      {cert.isVerified ? <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified</span> : <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Awaiting Review</span>}
                    </div>
                    <p className="text-stone-600 text-[11px] mt-0.5">{farmer.name} • Cert #{cert.certificateNumber}</p>
                  </div>
                  <button onClick={() => setCertPreview({ farmerId: farmer.id, certId: cert.id })} className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold rounded-xl text-xs cursor-pointer whitespace-nowrap">Inspect Document</button>
                </div>
              ))}
            </div>
          </div>