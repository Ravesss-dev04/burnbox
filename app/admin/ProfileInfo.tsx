import { AnimatePresence, motion } from "framer-motion";
import { Camera, Edit, Mail, Phone, Plus, Search, Trash, User, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  position: string;
  gender: string;
  picture: string | null;
}

const initialStaff: StaffMember[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Connor",
    middleName: "J",
    email: "sarah.c@burnbox.com",
    phone: "+63 923 456 7890",
    position: "Manager",
    gender: "Female",
    picture: null,
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    middleName: "",
    email: "john.d@burnbox.com",
    phone: "+63 923 456 7890",
    position: "Sales Representative",
    gender: "Male",
    picture: null,
  },


  {
    id: "3",
    firstName: "Shane",
    lastName: "shinichi",
    middleName: "",
    email: "john.d@burnbox.com",
    phone: "+63 923 456 7890",
    position: "Graphic Designer",
    gender: "Femboy",
    picture: null,
  },
];

const ProfileInfo = () => {
  const [showUpModal, setShowUpModal] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State


  const [formData, setFormData] = useState<Omit<StaffMember, "id">>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    position: "",
    gender: "Select Gender",
    picture: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount

  useEffect(() => {
    const saved = localStorage.getItem("staffList");
    if (saved) {
      setStaffList(JSON.parse(saved));
    }
  }, []);

  // save to local storage on change

  useEffect(() => {
    localStorage.setItem("staffList", JSON.stringify(staffList));
  }, [staffList]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, picture: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Edit existing
      setStaffList((prev) =>
        prev.map((staff) =>
          staff.id === editingId ? { ...formData, id: editingId } : staff
        )
      );
    } else {
      // Add new
      const newStaff: StaffMember = {
        ...formData,
        id: Date.now().toString(),
      };
      setStaffList((prev) => [...prev, newStaff]);
    }

    closeModal();
  };

  const handleEdit = (staff: StaffMember) => {
    setFormData(staff);
    setEditingId(staff.id);
    setShowUpModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    }
  };

  const closeModal = () => {
    setShowUpModal(false);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      position: "",
      gender: "Select Gender",
      picture: null,
    });
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide">
            Profile Details
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage personal details</p>
        </div>

        {/* personal details here */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative hidden sm:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-colors w-64"
            />
          </div>

          {/* Add new card */}
          <motion.button
            layout
            onClick={() => setShowUpModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-pink-600/50 to-purple-600 rounded-lg pr-4 py-2 text-white hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20"
          >
            <Plus size={18} />{" "}
            <span className="text-sm font-semibold whitespace-nowrap">
              {" "}
              Add New Staff{" "}
            </span>
          </motion.button>
        </div>
        {/* Modal */}
        <AnimatePresence>
        {showUpModal && (
          <motion.div 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40">
            <motion.div 
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 20}}
            className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold items-center">
                      {editingId
                        ? "Edit Staff Profile"
                        : "Add New Staff Member"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Fill in the information below
                    </p>
                  </div>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors font-bold"
                    onClick={closeModal}
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* form fields will go here */}
                  <div className="flex justify-center mb-8">
                      <div className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-600 group-hover:border-pink-500 transition-colors bg-zinc-800 flex items-center justify-center">
                          {formData.picture ? (
                            <Image src={formData.picture} alt="Preview" fill className="object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-pink-500 transition-colors">
                              <Camera size={32} className="mb-2" /> 
                              <span className="text-xs">Upload Photos</span>
                            </div>
                        )}
                        </div>

                        <div className="absolute bottom-0 right-0 bg-pink-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                          <Plus size={16} />
                        </div>
                      
                      <input type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      />
                      </div>
                  </div>

                
                {/* details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* name fields */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-xs font-medium text-gray-400 uppercase">First Name <span className="text-red-400 text-sm">*</span> </label>
                    <input type="text" 
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors p"
                      placeholder="Name"
                    />
                  </div>

                <div className="space-y-2">
                  <label htmlFor="" className="text-gray-400 text-xs font-medium uppercase">Last Name <span className="text-red-400 text-sm">*</span> </label>
                  <input type="text" 
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                    placeholder="Last Name"
                  />
                </div>
              
                <div className="space-y-2">
                    <label htmlFor="middle initial" className="text-gray-400 text-xs font-medium uppercase">Middle Name</label>
                    <input type="text" 
                      required
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                      placeholder="Middle Name"
                    />
                </div>
                  {/* contact info */}
                <div className="space-y-2">
                      <label className="text-gray-400 text-xs font-medium uppercase ">Email Address</label>
                      <input type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focuse:outline-none focus:border-pink-500/50 transition-colors"
                      placeholder="Email"
                      />
                </div>

                <div className="space-y-2">
                        <label className="text-gray-400 font-medium uppercase text-xs">Phone Number</label>
                        <input type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focuse:outline-none focus:border-pink-500/50 transition-colors"
                          placeholder="+63xxxxxxxxx"
                        />
                </div>
                    
                  <div className="space-y-2">
                        <label className="text-gray-400 font-medium uppercase text-xs">Position</label>
                        <input type="text"
                          name="position"
                          required
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                          placeholder="Position"
                        />
                  </div>
                  
                    <div className="space-y-2">
                        <label htmlFor="" className="text-gray-400 text-xs font-medium uppercase">Gender</label>
                       <select name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors [&>option]:bg-[#0a0a0a]"
                       >

                        <option disabled> Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                       </select>
                    </div> 

                    </div>
                      
                    <div className="flex gap-4 pt-6 border-t border-white/10 mt-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                      >
                          Cancel
                      </button>
                      <button className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg  shadow-pink-500/20 transition-all" type="submit">
                        {editingId ? 'Save Changes' : 'Add Staff Member'}
                      </button>
                    </div>

                </form>

              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      
      {/* staff grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredStaff.map((staff) => (
            <motion.div
              key={staff.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] flex flex-col h-[450px]"
            >
              {/* ID Card Header / Lanyard Hole visual */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1a1a1a] rounded-b-xl border-b border-x border-white/10 z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-black/50 rounded-full"></div>
              </div>
              
              {/* Company Branding Strip */}
              <div className="h-28 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                 <div className="absolute top-5 left-5 font-black text-white/90 tracking-[0.2em] text-[10px]">BURNBOX INC.</div>
                 <div className="absolute top-4 right-4 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold">BB</span>
                    </div>
                 </div>
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col items-center -mt-14 relative z-10">
                {/* Avatar */}
                <div className="relative w-28 h-28 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-800 shadow-2xl relative">
                     {staff.picture ? (
                      <Image src={staff.picture} alt={staff.firstName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#0a0a0a] p-1.5 rounded-full">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full border border-emerald-400 shadow-[0_0_10px_#10b981]"></div>
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-white text-center leading-tight mb-1">
                  {staff.firstName} {staff.lastName}
                </h3>
                <div className="mb-6">
                    <span className="px-3 py-1 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-wider border border-pink-500/20">
                    {staff.position}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="w-full space-y-3 mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">ID No.</span>
                    <span className="text-zinc-300 font-mono text-xs">BB-{staff.id.padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Email</span>
                    <span className="text-zinc-300 text-xs truncate max-w-[120px]" title={staff.email}>{staff.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Phone</span>
                    <span className="text-zinc-300 text-xs">{staff.phone}</span>
                  </div>
                </div>

                {/* Barcode / Footer */}
                <div className="w-full mt-auto pt-2 opacity-30 group-hover:opacity-60 transition-opacity flex flex-col items-center gap-1">
                   <div className="h-6 w-3/4 bg-white/20 mask-image: repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)"></div>
                   <span className="text-[8px] text-zinc-600 tracking-[0.5em] uppercase">Authorized Personnel</span>
                </div>
                
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 rounded-xl">
                   <button onClick={() => handleEdit(staff)} className="w-32 py-2.5 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm">
                      <Edit size={14} /> Edit
                   </button>
                   <button onClick={() => handleDelete(staff.id)} className="w-32 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
                      <Trash size={14} /> Remove
                   </button>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Card  */}
      </div>
    </div>
  );
};

export default ProfileInfo;
