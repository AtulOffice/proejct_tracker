<div className="bg-indigo-50 p-6 rounded-lg border-2 border-cyan-300 shadow-sm">
            <h3 className="font-bold text-lg text-cyan-800 mb-4">
              🔧 Development & Technical
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                {...InputConst[40]}
                value={formData.Development}
                handleChange={handleChange}
              />
              {["BOTH", "LOGIC"].includes(formData.Development) && (
                <SelectField
                  {...InputConst[59]}
                  value={formData.LogicPlace}
                  handleChange={handleChange}
                />
              )}

              {["BOTH", "SCADA"].includes(formData.Development) && (
                <SelectField
                  {...InputConst[60]}
                  value={formData.ScadaPlace}
                  handleChange={handleChange}
                />
              )}

              <SelectField
                {...InputConst[42]}
                value={formData.isMailSent}
                handleChange={handleChange}
              />

              {!["", "N/A"].includes(formData?.Development) && (
                <>
                  <SelectField
                    {...InputConst[43]}
                    value={formData.isDevlopmentApproved}
                    handleChange={handleChange}
                  />
                </>
              )}
            </div>
          </div>