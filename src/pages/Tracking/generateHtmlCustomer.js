import { formatDate, formatTime } from "../../utils/dateUtils";
import ReactDOMServer from "react-dom/server";

const generateLoadNotes = ({ loadp }) => {
	return loadp.statusHistory ? (
		loadp.statusHistory.map((history) => (
			<li style={{ fontSize: "14px" }} key={history.key}>
				<span style={{ fontSize: "14px" }}>
					{history.type === "location"
						? `Location Updated: ${history.currentLocationText}`
						: history.note}{" "}
					- {history.time}
				</span>
				{history.type === "location" && (
					<span style={{ fontSize: "14px", display: "block" }}>Note: {history.note}</span>
				)}
			</li>
		))
	) : (
		<li>
			<span>
				Load Created at - {formatDate(loadp.createdAt)} {formatTime(loadp.createdAt)}
			</span>
		</li>
	);
};

export const generatedHtmlCustomer = (load, user, mapSrc) => {
	const loadNotesHTMLString = (load) => {
		const notesJSX = generateLoadNotes({ loadp: load });
		const notesHTMLString = ReactDOMServer.renderToStaticMarkup(
			<ul className="elg-list" style={{ margin: 0, padding: "0 0 0 20px", listStyle: "disc" }}>
				{notesJSX}
			</ul>
		);
		return notesHTMLString;
	};

	const downLoadPOD =
		load.PODFiles && load.PODFiles.length
			? `<th>
  <a style="display:inline-block;border-radius:8px;background-color:#1595e7;padding:14px 19px 14px 19px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-weight:500;font-size:16px;line-height:150%;letter-spacing:-0.2px;color:#ffffff;vertical-align:top;text-align:center;margin-right: 10px;text-align-last:center;text-decoration:none" href="${load.PODFiles[0].location}" target="_blank" data-saferedirecturl="">Download POD</a>
</th>`
			: "";

	const downLoadBOL =
		load.BOLFiles && load.BOLFiles.length
			? `<th>
  <a style="display:inline-block;border-radius:8px;background-color:#1595e7;padding:14px 19px 14px 19px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-weight:500;font-size:16px;line-height:150%;letter-spacing:-0.2px;color:#ffffff;vertical-align:top;text-align:center;margin-right: 10px;text-align-last:center;text-decoration:none" href="${load.BOLFiles[0].location}" target="_blank" data-saferedirecturl="">Download BOL</a>
</th>`
			: "";

	const PodSrc =
		load.PODFiles && load.PODFiles.location
			? load.PODFiles.location
			: load.PODFiles && Array.isArray(load.PODFiles) && load.PODFiles.length
				? load.PODFiles[0].location
				: "";
	const BolSrc =
		load.BolFiles && load.BolFiles.location
			? load.BolFiles.location
			: load.BolFiles && Array.isArray(load.BolFiles) && load.BolFiles.length
				? load.BolFiles[0].location
				: "";
	const BolFile = load.BolFiles
		? `<a href="${BolSrc}" style="display:inline-block;border-radius:8px;background-color:#4fe82f;padding:14px 18px 14px 18px;padding-left:0;padding-right:0;width:100%;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-weight:500;font-size:16px;line-height:150%;letter-spacing:-0.2px;color:#ffffff;vertical-align:top;text-align:center;text-align-last:center;text-decoration:none">View BOL</a>`
		: "";
	const PodFile = load.BolFiles
		? `<a href="${PodSrc}" style="display:inline-block;border-radius:8px;background-color:#4fe82f;padding:14px 18px 14px 18px;padding-left:0;padding-right:0;width:100%;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-weight:500;font-size:16px;line-height:150%;letter-spacing:-0.2px;color:#ffffff;vertical-align:top;text-align:center;text-align-last:center;text-decoration:none">View POD</a>`
		: "";

	return `<table style="table-layout:fixed;min-width:600px;background-color:#f4f4f4" bgcolor="#f4f4f4" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
    <tbody><tr>
     <td align="center" valign="top">
      <table style="width:600px;max-width:600px" width="600" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
       <tbody><tr>
        <td style="padding:20px 0px 20px 0px" align="left" valign="top">
         <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%">
          <tbody><tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 
                 <td valign="top" style="background-size:cover;background-position:center;background-repeat:no-repeat;padding:36px 40px 36px 40px;border-radius:0px;background-color:transparent" bgcolor="transparent" background="https://ci3.googleusercontent.com/meips/ADKq_NYEuJeWS3M0gulaXrf1-FqCG73kj2NuhBV-8E5dfZbapTKSyWfK2M7PIaeLNBC2iy6b9fDU8XjadLj4Rxj4TrhuctUtbrAG657_fI-DzgBk=s0-d-e1-ft#https://cloudfilesdm.com/postcards/image-1713281331227.png">
                  
                  
                  
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td align="center" valign="top" style="padding:0px 0px 0px 0px">
                     <img src="https://ci3.googleusercontent.com/meips/ADKq_Nbw8_IkgGAqBqvkc9OvwwAEXiTFh2ILLL5p6c-eszM4NGSUY8wECvvzInP6nCPYZVtld75z6JCJKS3cpKcOdDBxrfM-rlZ-mH04jWq_NG_c=s0-d-e1-ft#https://cloudfilesdm.com/postcards/image-1713281317060.png" width="196" height="63" alt="" style="display:block;border:0;outline:0;line-height:100%;width:196px;height:auto;max-width:100%" class="CToWUd" data-bit="iit">
                    </td>
                   </tr>
                  </tbody></table>
                  
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:15px 40px 0px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse:separate;border-spacing:0">
                   <tbody><tr>
                    <td valign="top" align="center" style="padding:0px 0px 0px 0px">
                     <div style="line-height:166%;letter-spacing:-0.5px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-size:19px;font-weight:500;font-variant-ligatures:normal;color:#434343;text-transform:uppercase;text-decoration:underline;text-align:center;text-align-last:center">
                      <div><span style="font-weight:400;font-style:normal;color:rgb(31,31,31)"> ${
	load.pickUpList[0].pickUpLocation
} -- ${load.destinationList[0].destination} </span>
                      </div>
                     </div>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:50px 40px 30px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td>
                     <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody><tr>
                       <td align="left" valign="top" style="width:50%;padding-top:0px;padding-right:19px;padding-bottom:0px;padding-left:0px">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0;width:100%">
                         <tbody><tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
                            <tbody><tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tbody><tr>
                                <td>
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tbody><tr>
                                   <td align="left" valign="middle" style="padding-top:0px;padding-right:5px;padding-bottom:0px;padding-left:0px">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                     <tbody><tr>
                                      <td align="left" valign="top">
                                       <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody><tr>
                                         <td align="left" valign="top">
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td align="left" valign="top">
                                             <img src="https://ci3.googleusercontent.com/meips/ADKq_Nbb3o6cc572KlwSteGtSGjE_nk5LdlBBrp1tGI6BsVBHxU5xpIaXjouUlhenyGYMKNUs_ATzWnbq2oocT7BlGVjAIFPwfab7Q62hbFJSHXI=s0-d-e1-ft#https://cloudfilesdm.com/postcards/image-1713282401472.png" width="60" height="60" alt="" style="display:block;border:0;outline:0;line-height:100%;width:60px;height:60px;border-radius:8px" class="CToWUd" data-bit="iit">
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                       </tbody></table>
                                      </td>
                                     </tr>
                                    </tbody></table>
                                   </td>
                                   <td align="left" valign="middle" style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:5px">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                     <tbody><tr>
                                      <td align="left" valign="top">
                                       <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody><tr>
                                         <td align="left" valign="top">
                                          <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td valign="top" style="padding:0px 0px 6px 0px">
                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                              <tbody><tr>
                                               <td valign="top">
                                                <div style="line-height:150%;letter-spacing:-0.1px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;font-variant-ligatures:normal;color:#1b1b1b">
                                                 <div><span>${user.name}</span>
                                                 </div>
                                                </div>
                                               </td>
                                              </tr>
                                             </tbody></table>
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                        <tr>
                                         <td align="left" valign="top">
                                          <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td valign="top" style="padding:0px 0px 0px 0px">
                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                              <tbody><tr>
                                               <td valign="top">
                                                <div style="line-height:143%;letter-spacing:-0.2px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-size:14px;font-weight:normal;font-variant-ligatures:normal;color:#9b9b9b">
                                                 <div><span>${user.group?.title}</span>
                                                 </div>
                                                 <div><span><a href="mailto:${
	user.email
}" target="_blank">${user.email}</a></span>
                                                 </div>
                                                </div>
                                               </td>
                                              </tr>
                                             </tbody></table>
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                       </tbody></table>
                                      </td>
                                     </tr>
                                    </tbody></table>
                                   </td>
                                  </tr>
                                 </tbody></table>
                                </td>
                               </tr>
                              </tbody></table>
                             </td>
                            </tr>
                           </tbody></table>
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                       <td align="left" valign="top" style="width:50%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:19px">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0;width:100%">
                         <tbody><tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
                            <tbody><tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tbody><tr>
                                <td>
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tbody><tr>
                                   <td align="left" valign="middle" style="padding-top:0px;padding-right:5px;padding-bottom:0px;padding-left:0px">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                     <tbody><tr>
                                      <td align="left" valign="top">
                                       <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody><tr>
                                         <td align="left" valign="top">
                                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td align="left" valign="top">
                                             
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                       </tbody></table>
                                      </td>
                                     </tr>
                                    </tbody></table>
                                   </td>
                                   <td align="left" valign="middle" style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:5px">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                     <tbody><tr>
                                      <td align="left" valign="top">
                                       <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody><tr>
                                         <td align="left" valign="top">
                                          <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td valign="top" style="padding:0px 0px 6px 0px">
                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                              <tbody><tr>
                                               <td valign="top">
                                                <div style="line-height:150%;letter-spacing:-0.1px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;font-variant-ligatures:normal;color:#1b1b1b">
                                              
                                                 </div>
                                                </div>
                                               </td>
                                              </tr>
                                             </tbody></table>
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                        <tr>
                                         <td align="left" valign="top">
                                          <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                           <tbody><tr>
                                            <td valign="top" style="padding:0px 0px 0px 0px">
                                             <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                                              <tbody><tr>
                                               <td valign="top">
                                                <div style="line-height:143%;letter-spacing:-0.2px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-size:14px;font-weight:normal;font-variant-ligatures:normal;color:#9b9b9b">
                                              
                                                 </div>
                                                
                                                 </div>
                                                </div>
                                               </td>
                                              </tr>
                                             </tbody></table>
                                            </td>
                                           </tr>
                                          </tbody></table>
                                         </td>
                                        </tr>
                                       </tbody></table>
                                      </td>
                                     </tr>
                                    </tbody></table>
                                   </td>
                                  </tr>
                                 </tbody></table>
                                </td>
                               </tr>
                              </tbody></table>
                             </td>
                            </tr>
                           </tbody></table>
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                      </tr>
                     </tbody></table>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:0px 40px 40px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td>
                     <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody><tr>
                       <td align="center" valign="top" style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0;width:100%">
                         <tbody><tr>
                          
                          <td>
                          <img style="width: 100%;height: auto;border-radius: 7px;" src="${mapSrc}" alt="Tracking Image">
                           
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                      </tr>
                     </tbody></table>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:0px 40px 15px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td align="center">
                     <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody><tr>
                       <td valign="middle" style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                         <tbody><tr>
                          <td align="center" valign="middle">
                           <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tbody><tr>
                             <td align="center" valign="top">
                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tbody><tr>
                                ${downLoadBOL}
                                ${downLoadPOD}
                                <th valign="top" align="center" style="font-weight:normal;line-height:1">
                                  <a style="display:inline-block;border-radius:8px;background-color:#1595e7;padding:14px 19px 14px 19px;font-family:Fira Sans,Arial,Helvetica,sans-serif;font-weight:500;font-size:16px;line-height:150%;letter-spacing:-0.2px;color:#ffffff;vertical-align:top;text-align:center;text-align-last:center;text-decoration:none" href="" target="_blank" data-saferedirecturl="">Request Update</a>
                                </th>
                               </tr>
                              </tbody></table>
                             </td>
                            </tr>
                           </tbody></table>
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                      </tr>
                     </tbody></table>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:15px 40px 0px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                   <tbody><tr>
                    <td valign="top">
                     <div style="line-height:133%;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:normal;font-variant-ligatures:normal;color:#434343">
                      ${loadNotesHTMLString(load)}
                     </div>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 <td valign="top" style="padding:15px 40px 15px 40px;border-radius:0px;background-color:#ffffff" bgcolor="#ffffff">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td>
                     <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tbody><tr>
                       <td align="left" valign="top" style="width:50%;padding-top:0px;padding-right:7px;padding-bottom:0px;padding-left:0px">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0;width:100%">
                         <tbody><tr>
                          <td align="center" valign="middle">
                           <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
                            <tbody><tr>
                             <td align="center" valign="top">
                              <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tbody><tr>
                                <th valign="top" align="center" style="padding:0px 0px 0px 0px;font-weight:normal;line-height:1">
                                 
                                 ${BolFile}
                                 
                                </th>
                               </tr>
                              </tbody></table>
                             </td>
                            </tr>
                           </tbody></table>
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                       <td align="left" valign="top" style="width:50%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:7px">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0;width:100%">
                         <tbody><tr>
                          <td align="center" valign="middle">
                           <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
                            <tbody><tr>
                             <td align="center" valign="top">
                              <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tbody><tr>
                                <th valign="top" align="center" style="padding:0px 0px 0px 0px;font-weight:normal;line-height:1">
                                 
                                 ${PodFile}
                                 
                                </th>
                               </tr>
                              </tbody></table>
                             </td>
                            </tr>
                           </tbody></table>
                          </td>
                         </tr>
                        </tbody></table>
                       </td>
                      </tr>
                     </tbody></table>
                    </td>
                   </tr>
                  </tbody></table>
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
          <tr>
           <td valign="top">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tbody><tr>
              <td style="padding:0px 0px 0px 0px">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tbody><tr>
                 
                 <td valign="top" style="background-size:cover;background-position:center;background-repeat:no-repeat;padding:40px 40px 40px 40px;border-radius:0px;background-color:transparent" bgcolor="transparent" background="https://ci3.googleusercontent.com/meips/ADKq_NYEuJeWS3M0gulaXrf1-FqCG73kj2NuhBV-8E5dfZbapTKSyWfK2M7PIaeLNBC2iy6b9fDU8XjadLj4Rxj4TrhuctUtbrAG657_fI-DzgBk=s0-d-e1-ft#https://cloudfilesdm.com/postcards/image-1713281331227.png">
                  
                  
                  
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tbody><tr>
                    <td align="center" valign="top" style="padding:0px 0px 14px 0px">
                     <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;border-spacing:0">
                      <tbody><tr>
                       <td valign="top" align="center">
                        <div style="line-height:143%;letter-spacing:-0.2px;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:normal;font-variant-ligatures:normal;color:#ffffff;text-align:center;text-align-last:center">
                         <div><span>Thank you for hauling with Efficiency Logistics LLC!</span>
                         </div>
                         <div><span>Please let us know if you have anything else we can help you out with.</span>
                         </div>
                         <div><span></span>
                         </div>
                         <div><span>Have a great rest of your day! </span>
                         </div>
                        </div>
                       </td>
                      </tr>
                     </tbody></table>
                    </td>
                   </tr>
                  </tbody></table>
                  
                 </td>
                </tr>
               </tbody></table>
              </td>
             </tr>
            </tbody></table>
            
           </td>
          </tr>
         </tbody></table>
        </td>
       </tr>
      </tbody></table>
     </td>
    </tr>
   </tbody></table>`;
};
