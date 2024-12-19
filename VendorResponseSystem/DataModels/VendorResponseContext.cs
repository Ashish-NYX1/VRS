using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VendorResponseSystem.DataModels;

public partial class VendorResponseContext : DbContext
{
    public VendorResponseContext()
    {
    }

    public VendorResponseContext(DbContextOptions<VendorResponseContext> options)
        : base(options)
    {
    }
    public virtual DbSet<Buyer> Buyers { get; set; }

    public virtual DbSet<BuyerVendorConfiguration> BuyerVendorConfigurations { get; set; }

    public virtual DbSet<PodataUsa> PodataUsas { get; set; }

    public virtual DbSet<VendorContact> VendorContacts { get; set; }

    public virtual DbSet<Vendorresponsedatalog> Vendorresponsedatalogs { get; set; }

    public virtual DbSet<BuyerVendorRequestResponse> BuyerVendorRequestResponses { get; set; }
    public virtual DbSet<Work> Works { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
         => optionsBuilder.UseSqlServer("server=NYXWEB5\\NYXWEB5;user=sa;password=spec007$;database=VendorResponse; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Buyer>(entity =>
        {
            entity.HasKey(e => new { e.Database, e.Buyercode });

            entity.Property(e => e.Database)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("DATABASE");
            entity.Property(e => e.Buyercode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYERCODE");
            entity.Property(e => e.Buyermail)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYERMAIL");
            entity.Property(e => e.Buyername)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYERNAME");
        });

        modelBuilder.Entity<BuyerVendorConfiguration>(entity =>
        {
            entity.HasKey(e => new { e.Buyercode, e.Vendcode });

            entity.ToTable("BuyerVendorConfiguration");

            entity.Property(e => e.Buyercode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYERCODE");
            entity.Property(e => e.Vendcode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDCODE");
            entity.Property(e => e.Confirmeddeliverydate).HasColumnName("CONFIRMEDDELIVERYDATE");
            entity.Property(e => e.Confirmedprice).HasColumnName("CONFIRMEDPRICE");
            entity.Property(e => e.Confirmedquantity).HasColumnName("CONFIRMEDQUANTITY");
            entity.Property(e => e.Confirmedtrackingno).HasColumnName("CONFIRMEDTRACKINGNO");
            entity.Property(e => e.Vendorcomments).HasColumnName("VENDORCOMMENTS");
            entity.Property(e => e.Nyxnotes).HasColumnName("NYXNOTES");
            entity.Property(e => e.Frequency).HasColumnName("FREQUENCY");
            entity.Property(e => e.Isactive).HasColumnName("ISACTIVE");
            entity.Property(e => e.Isdelete).HasColumnName("ISDELETE");
        });

        modelBuilder.Entity<PodataUsa>(entity =>
        {
            entity.HasKey(e => new { e.Database, e.Vendcode, e.Po, e.Poitem, e.Nyxpart });

            entity.ToTable("POdata_USA");

            entity.Property(e => e.Database)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("DATABASE");
            entity.Property(e => e.Vendcode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDCODE");
            entity.Property(e => e.Po)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("PO");
            entity.Property(e => e.Poitem)
                .HasColumnType("numeric(3, 0)")
                .HasColumnName("POITEM");
            entity.Property(e => e.Nyxpart)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("NYXPART");
            entity.Property(e => e.Buyer)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYER");
            entity.Property(e => e.Desc1)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DESC1");
            entity.Property(e => e.Desc2)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DESC2");
            entity.Property(e => e.Desc3)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DESC3");
            entity.Property(e => e.Desc4)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DESC4");
            entity.Property(e => e.Desc5)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("DESC5");
            entity.Property(e => e.Potype)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("POTYPE");
            entity.Property(e => e.Qtyorder)
                .HasColumnType("numeric(11, 2)")
                .HasColumnName("QTYORDER");
            entity.Property(e => e.Qtyreceived)
                .HasColumnType("numeric(15, 5)")
                .HasColumnName("QTYRECEIVED");
            entity.Property(e => e.Requiredate)
                .HasColumnType("date")
                .HasColumnName("REQUIREDATE");
            entity.Property(e => e.Unitprice)
                .HasColumnType("numeric(13, 5)")
                .HasColumnName("UNITPRICE");
            entity.Property(e => e.Vendcontact)
                .HasMaxLength(18)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDCONTACT");
            entity.Property(e => e.Vendemail)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDEMAIL");
            entity.Property(e => e.Vendname)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDNAME");
        });

        modelBuilder.Entity<VendorContact>(entity =>
        {
            entity.HasKey(e => e.Vendcode);

            entity.Property(e => e.Vendcode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDCODE");
            entity.Property(e => e.Isactive).HasColumnName("ISACTIVE");
            entity.Property(e => e.Isdelete).HasColumnName("ISDELETE");
            entity.Property(e => e.Vendoremail)
                .HasMaxLength(500)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDOREMAIL");
            entity.Property(e => e.Vendorname)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDORNAME");
        });

        modelBuilder.Entity<Vendorresponsedatalog>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("VENDORRESPONSEDATALOGS");

            entity.Property(e => e.ErrorCreatedDate).HasColumnType("datetime");
            entity.Property(e => e.ErrorMessage).IsUnicode(false);
            entity.Property(e => e.ErrorProcedure)
                .HasMaxLength(100)
                .IsUnicode(false);
        });
        modelBuilder.Entity<BuyerVendorRequestResponse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_BuyerVendorRequestResponse_1");

            entity.ToTable("BuyerVendorRequestResponse");

            entity.Property(e => e.Buyercode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("BUYERCODE");
            entity.Property(e => e.Isactive).HasColumnName("ISACTIVE");
            entity.Property(e => e.Isdelete).HasColumnName("ISDELETE");
            entity.Property(e => e.Po)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("PO");
            entity.Property(e => e.Poitem)
                .HasColumnType("numeric(3, 0)")
                .HasColumnName("POITEM");
            entity.Property(e => e.Requestbody).HasColumnName("REQUESTBODY");
            entity.Property(e => e.Requestdate)
                .HasColumnType("datetime")
                .HasColumnName("REQUESTDATE");
            entity.Property(e => e.Responsebody).HasColumnName("RESPONSEBODY");
            entity.Property(e => e.Responsedate)
                .HasColumnType("datetime")
                .HasColumnName("RESPONSEDATE");
            entity.Property(e => e.Vendcode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("VENDCODE");
        });
        modelBuilder.Entity<Work>(entity =>
        {
            entity.ToTable("Work");

            entity.Property(e => e.BuyerCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeliveryDate).HasColumnType("date");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.Po)
                .HasColumnType("numeric(9, 0)")
                .HasColumnName("PO");
            entity.Property(e => e.Poitem)
                .HasColumnType("numeric(3, 0)")
                .HasColumnName("POITEM");
            entity.Property(e => e.Price).HasColumnType("numeric(13, 5)");
            entity.Property(e => e.Quantity).HasColumnType("numeric(15, 5)");
            entity.Property(e => e.TrackingNumber).HasMaxLength(50);
            entity.Property(e => e.VendCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public void UpdateVendorEmail(string vendCode, string vendEmail)
    {
        var codeParam = new SqlParameter("@VendCode", vendCode);
        var emailParam = new SqlParameter("@VendEmail", vendEmail);
        Database.ExecuteSqlRaw("EXEC UpdateVendorEmail @VendCode, @VendEmail", codeParam, emailParam);
    }
}
